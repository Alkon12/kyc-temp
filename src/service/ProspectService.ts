import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import AbstractProspectService, {
  ProspectAddNoteProps,
  ProspectGetAllFilters,
  ProspectLogActivityProps,
  ProspectReassignSupportUserProps,
  ProspectUpdateStatusProps,
} from '@domain/prospect/ProspectService'
import { OverviewCount } from '@domain/shared/OverviewCount'
import type QuoteRepository from '@domain/quote/QuoteRepository'
import { QuoteEntity } from '@domain/quote/QuoteEntity'
import {
  ProspectCountByScoringMark,
  ProspectOverviewResponse,
  ProspectSituationCount,
} from '@domain/prospect/interfaces/ProspectOverviewResponse'
import { UserId } from '@domain/user/models/UserId'
import { ProspectEntity, ProspectEntityProps } from '@domain/prospect/ProspectEntity'
import type ProspectRepository from '@domain/prospect/ProspectRepository'
import { UnexpectedError, ValidationError } from '@domain/error'
import { ProspectFactory } from '@domain/prospect/ProspectFactory'
import { ProspectStatusId } from '@domain/prospect/models/ProspectStatusId'
import type ProspectActivityRepository from '@domain/prospect/ProspectActivityRepository'
import { ProspectActivityFactory } from '@domain/prospect/ProspectActivityFactory'
import { ProspectActivityTypeId } from '@domain/prospect/models/ProspectActivityTypeId'
import { ProspectActivityEntity } from '@domain/prospect/ProspectActivityEntity'
import { UUID } from '@domain/shared/UUID'
import { StringValue } from '@domain/shared/StringValue'
import { ProspectStatusEntity } from '@domain/prospect/ProspectStatusEntity'
import { forEach } from 'lodash'
import { DateTimeValue } from '@domain/shared/DateTime'
import AbstractUserService from '@domain/user/UserService'

@injectable()
export class ProspectService implements AbstractProspectService {
  @inject(DI.QuoteRepository)
  private readonly _quoteRepository!: QuoteRepository
  @inject(DI.UserService)
  private readonly _userService!: AbstractUserService
  @inject(DI.ProspectRepository)
  private readonly _prospectRepository!: ProspectRepository
  @inject(DI.ProspectActivityRepository)
  private readonly _prospectActivityRepository!: ProspectActivityRepository

  async getOrCreate(props: Partial<ProspectEntityProps>): Promise<ProspectEntity> {
    const userId = props.userId
    if (!userId) {
      throw new ValidationError('userId is required')
    }

    const existingProspect = await this._prospectRepository.getByUser(userId)

    return existingProspect || this.create(props)
  }

  async create(props: Partial<ProspectEntityProps>): Promise<ProspectEntity> {
    const userId = props.userId
    if (!userId) {
      throw new ValidationError('userId is required')
    }

    const prepareProspect = ProspectFactory.create({
      userId,
      prospectStatusId: ProspectStatusId.PROSPECT_CREATED,
      friendlyId: new StringValue(this._generateFriendlyId()),
      lastActivityUserId: userId,
      supportUserId: props.supportUserId,
    })

    const prospect = await this._prospectRepository.create(prepareProspect)

    const prepareProspectActivity = ProspectActivityFactory.create({
      prospectId: prospect.getId(),
      createdByUserId: userId,
      prospectActivityTypeId: ProspectActivityTypeId.PROSPECT_CREATED,
    })

    await this._prospectActivityRepository.create(prepareProspectActivity)

    return prospect
  }

  async overview(): Promise<ProspectOverviewResponse> {
    // TODO remove quotes with applications
    const quotes = await this._quoteRepository.getAll(true)

    const countByMark = this._getByQuoteScoringMarkCount(quotes)

    return {
      byQuoteScoringMark: countByMark,
      bySituation: this._getBySituation(quotes),
    }
  }

  async getAll(filters: ProspectGetAllFilters): Promise<ProspectEntity[]> {
    const prospectStatusIdFilter: ProspectStatusId[] = []
    forEach(filters.tags, (tag) => {
      console.log('tag', tag)
      const tagSegments = tag.toDTO().split('#')
      if (tagSegments.length > 1 && tagSegments[0] === 'PROSPECT_STATUS_ID') {
        prospectStatusIdFilter.push(new ProspectStatusId(tagSegments[1]))
      }
    })

    const prospectSupportUserIdFilter: UserId[] = []
    forEach(filters.tags, (supportUser) => {
      console.log('support user', supportUser)
      const supportUserSegments = supportUser.toDTO().split('#')
      if (supportUserSegments.length > 1 && supportUserSegments[0] === 'SUPPORT_USER_ID') {
        prospectSupportUserIdFilter.push(new UserId(supportUserSegments[1]))
      }
    })

    const search = filters.search ? new StringValue(filters.search.toDTO().trim()) : undefined

    const updatedBefore = filters.inactivityInHours
      ? new DateTimeValue(new Date()).subtractHours(filters.inactivityInHours.toDTO())
      : undefined

    return this._prospectRepository.getAll({
      prospectStatusId: prospectStatusIdFilter,
      search,
      supportUserId: prospectSupportUserIdFilter,
      withApplication: filters.withApplication,
      withQuotes: filters.withQuotes,
      withoutAssignedSupportUser: filters.withoutAssignedSupportUser,
      updatedBefore,
    })
  }

  async updateStatus(props: ProspectUpdateStatusProps): Promise<ProspectEntity> {
    const prospect = await this._prospectRepository.getById(props.prospectId)
    if (!prospect) {
      throw new UnexpectedError('Problem fetching the prospect')
    }

    prospect.setProspectStatus(props.prospectStatusId)
    await this._prospectRepository.save(prospect)

    const prepareProspectActivity = ProspectActivityFactory.create({
      prospectId: prospect.getId(),
      createdByUserId: props.userId,
      prospectActivityTypeId: ProspectActivityTypeId.PROSPECT_STATUS_UPDATED,
      prospectStatusId: props.prospectStatusId,
      notes: props.notes,
    })
    await this._prospectActivityRepository.create(prepareProspectActivity)
    await this._updateLastActivity(prospect.getId(), props.userId)

    return prospect
  }

  async setActiveApplication(prospectId: UUID, applicationId?: UUID): Promise<ProspectEntity> {
    const prospect = await this._prospectRepository.getById(prospectId)
    if (!prospect) {
      throw new UnexpectedError('Problem fetching the prospect')
    }

    prospect.setActiveApplicationId(applicationId)
    await this._prospectRepository.save(prospect)

    // const systemUser = await this._userService.getSystemUser()

    // // The logic to unset if application is expired is in the application service
    // if(applicationId) {
    //   await this.logActivity({
    //     userId: systemUser.getId(),
    //     prospectId,
    //     prospectActivityTypeId: ProspectActivityTypeId.APPLICATION_CREATED,
    //   })
    // }

    return prospect
  }

  async reassignSupportUser(props: ProspectReassignSupportUserProps): Promise<ProspectEntity> {
    const prospect = await this._prospectRepository.getById(props.prospectId)
    if (!prospect) {
      throw new UnexpectedError('Problem fetching the prospect')
    }

    prospect.setSupportUserId(props.supportUserId)
    await this._prospectRepository.save(prospect)

    const supportIUser = await this._userService.getById(props.supportUserId)

    const prepareProspectActivity = ProspectActivityFactory.create({
      prospectId: prospect.getId(),
      createdByUserId: props.userId,
      prospectActivityTypeId: ProspectActivityTypeId.PROSPECT_SUPPORT_USER_ASSIGNED,
      notes: new StringValue(`A: ${supportIUser.getFullname().toDTO()}, ${props.notes?.toDTO() || ''}`),
    })
    await this._prospectActivityRepository.create(prepareProspectActivity)
    await this._updateLastActivity(prospect.getId(), props.userId)

    return prospect
  }

  async addNote(props: ProspectAddNoteProps): Promise<ProspectActivityEntity[]> {
    const prepareProspectActivity = ProspectActivityFactory.create({
      prospectId: props.prospectId,
      createdByUserId: props.userId,
      prospectActivityTypeId: ProspectActivityTypeId.NOTE,
      notes: props.notes,
    })
    const prospectActivity = await this._prospectActivityRepository.create(prepareProspectActivity)
    await this._updateLastActivity(props.prospectId, props.userId)

    return prospectActivity
  }

  async logActivity(props: ProspectLogActivityProps): Promise<ProspectActivityEntity[]> {
    const prepareProspectActivity = ProspectActivityFactory.create({
      prospectId: props.prospectId,
      createdByUserId: props.userId,
      prospectActivityTypeId: props.prospectActivityTypeId,
      notes: props.notes,
    })
    const prospectActivity = await this._prospectActivityRepository.create(prepareProspectActivity)
    await this._updateLastActivity(props.prospectId, props.userId)

    return prospectActivity
  }

  async getAvailableProspectStatusList(prospectId?: UUID): Promise<ProspectStatusEntity[]> {
    const prospectStatusList = await this._prospectRepository.getProspectStatusList()

    return prospectStatusList.filter((ps) => ps.isManualAssignable())
  }

  _getByQuoteScoringMarkCount = (quotes: QuoteEntity[]): ProspectCountByScoringMark => {
    // const count = quotes.reduce((acc, it) => {
    //   const mark = it.getScoringMark()?.toDTO()

    //   // filtering quotes with no score
    //   if (!mark) {
    //     return acc
    //   }

    //   return acc[mark] ? ++acc[mark] : (acc[mark] = 1), acc
    // }, {} as Dict<number>)

    const defaultCounts = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      F: 0,
      NoScore: 0,
    }

    return {
      ...defaultCounts,
      // ...count,
    }
  }

  _getBySituation = (quotes: QuoteEntity[]): ProspectSituationCount => {
    const recent = quotes.filter((l) => l.isRecent()).length
    const active = quotes.filter((l) => l.isActive()).length
    const expired = quotes.filter((l) => l.isExpired()).length

    return {
      recent: new OverviewCount(recent).toDTO(),
      active: new OverviewCount(active).toDTO(),
      expired: new OverviewCount(expired).toDTO(),
    }
  }

  async getByUserId(userId: UserId): Promise<ProspectEntity | null> {
    return this._prospectRepository.getByUser(userId)
  }

  async getById(prospectId: UUID): Promise<ProspectEntity | null> {
    return this._prospectRepository.getById(prospectId)
  }

  private _generateFriendlyId(): string {
    const millis = Date.now().toString()
    const reduced = millis.slice(millis.length - 8)
    const rand = Math.floor(Math.random() * 100)
    return `PRO-${reduced}${rand}`
  }

  private async _updateLastActivity(prospectId: UUID, userId: UserId): Promise<boolean> {
    const prospect = await this._prospectRepository.getById(prospectId)
    if (!prospect) {
      throw new UnexpectedError('Problem fetching the prospect to update last activity')
    }

    prospect.setLastActivityUserId(userId)
    prospect.setLastActivityAt(new DateTimeValue(new Date()))
    await this._prospectRepository.save(prospect)

    return true
  }
}
