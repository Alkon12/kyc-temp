import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import {
  MutationProspectAddNoteArgs,
  MutationProspectReassignSupportUserArgs,
  MutationProspectUpdateStatusArgs,
  ProspectOverview,
  QueryGetProspectsArgs,
  QueryProspectByIdArgs,
  QueryProspectByUserIdArgs,
} from '../app.schema.gen'
import AbstractProspectService from '@domain/prospect/ProspectService'
import { UserId } from '@domain/user/models/UserId'
import { NotFoundError } from '@domain/error'
import { DTO } from '@domain/kernel/DTO'
import { ProspectEntity } from '@domain/prospect/ProspectEntity'
import { ProspectFactory } from '@domain/prospect/ProspectFactory'
import { QuoteEntity } from '@domain/quote/QuoteEntity'
import { ApiContext } from '@api/shared/Api'
import { UUID } from '@domain/shared/UUID'
import { ProspectStatusId } from '@domain/prospect/models/ProspectStatusId'
import { StringValue } from '@domain/shared/StringValue'
import { ProspectActivityEntity } from '@domain/prospect/ProspectActivityEntity'
import ProspectRepository from '@domain/prospect/ProspectRepository'
import { ProspectStatusEntity } from '@domain/prospect/ProspectStatusEntity'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { NumberValue } from '@domain/shared/NumberValue'
import AbstractQuoteService from '@domain/quote/QuoteService'

@injectable()
export class ProspectResolvers {
  build() {
    return {
      Query: {
        prospectOverview: this.prospectOverview,
        getProspects: this.getProspects,
        prospectByUserId: this.prospectByUserId,
        prospectById: this.prospectById,
        prospectActivity: this.prospectActivity,
        getAvailableProspectStatusList: this.getAvailableProspectStatusList,
      },
      Mutation: {
        prospectUpdateStatus: this.prospectUpdateStatus,
        prospectAddNote: this.prospectAddNote,
        prospectReassignSupportUser: this.prospectReassignSupportUser,
      },
      Prospect: {
        quoteCount: this.prospectQuoteCount,
        lastQuote: this.prospectLastQuote,
        // lastActivityAt: this.prospectLastActivityAt,
        // lastActivityAt: this.prospectLastActivityAt,
      },
    }
  }

  prospectOverview = async (): Promise<ProspectOverview> => {
    const prospectService = container.get<AbstractProspectService>(DI.ProspectService)
    const prospectOverview = await prospectService.overview()

    return prospectOverview
  }

  getProspects = async (_parent: unknown, { filters }: QueryGetProspectsArgs): Promise<DTO<ProspectEntity[]>> => {
    const prospectService = container.get<AbstractProspectService>(DI.ProspectService)

    const filtersParsed = {
      tags: filters?.tags?.map((tag) => new StringValue(tag)) ?? [],
      search: filters?.search ? new StringValue(filters?.search) : undefined,
      supportUserId: filters?.supportUserId?.map((su) => new UserId(su)) ?? [],
      withApplication: filters?.withApplication ? new BooleanValue(filters?.withApplication) : undefined,
      withQuotes: filters?.withQuotes ? new BooleanValue(filters?.withQuotes) : undefined,
      withoutAssignedSupportUser: filters?.withoutAssignedSupportUser
        ? new BooleanValue(filters?.withoutAssignedSupportUser)
        : undefined,
      inactivityInHours: filters?.inactivityInHours ? new NumberValue(filters?.inactivityInHours) : undefined,
    }

    const prospects = await prospectService.getAll(filtersParsed)

    return prospects.map((p) => p.toDTO())
  }

  prospectByUserId = async (_parent: unknown, { userId }: QueryProspectByUserIdArgs): Promise<DTO<ProspectEntity>> => {
    const prospectService = container.get<AbstractProspectService>(DI.ProspectService)
    const prospect = await prospectService.getByUserId(new UserId(userId))
    if (!prospect) {
      throw new NotFoundError('Prospect not found')
    }

    return prospect.toDTO()
  }

  prospectQuoteCount = async (parent: DTO<ProspectEntity>, _: unknown): Promise<number> => {
    const prospect = ProspectFactory.fromDTO(parent)

    return prospect.getQuoteCount()
  }

  prospectLastQuote = async (parent: DTO<ProspectEntity>, _: unknown): Promise<DTO<QuoteEntity | null>> => {
    const quoteService = container.get<AbstractQuoteService>(DI.QuoteService)
    const prospect = ProspectFactory.fromDTO(parent)

    const lastQuoteId = prospect.getQuotes().length > 0 ? prospect.getQuotes()[0].getId() : null
    if (!lastQuoteId) {
      return null
    }

    const lastQuote = await quoteService.getById(lastQuoteId)
    if (!lastQuote) {
      return null
    }

    return lastQuote.toDTO()
  }

  // prospectLastActivityAt = async (parent: DTO<ProspectEntity>, _: unknown): Promise<DTO<DateTimeValue>> => {
  //   const prospect = ProspectFactory.fromDTO(parent)

  //   return prospect.getUpdatedAt().toDTO()
  // }

  prospectUpdateStatus = async (
    _parent: unknown,
    { prospectId, prospectStatusId, notes }: MutationProspectUpdateStatusArgs,
    context: ApiContext,
  ): Promise<DTO<ProspectActivityEntity[]>> => {
    const prospectService = container.get<AbstractProspectService>(DI.ProspectService)

    const prospect = await prospectService.updateStatus({
      userId: context.userId,
      prospectId: new UUID(prospectId),
      prospectStatusId: new ProspectStatusId(prospectStatusId),
      notes: notes ? new StringValue(notes) : undefined,
    })

    const prospectRepository = container.get<ProspectRepository>(DI.ProspectRepository)
    const activity = await prospectRepository.getActivity(prospect.getId())

    return activity.map((a) => a.toDTO())
  }

  prospectAddNote = async (
    _parent: unknown,
    { prospectId, notes }: MutationProspectAddNoteArgs,
    context: ApiContext,
  ): Promise<DTO<ProspectActivityEntity[]>> => {
    const prospectService = container.get<AbstractProspectService>(DI.ProspectService)

    const activity = await prospectService.addNote({
      userId: context.userId,
      prospectId: new UUID(prospectId),
      notes: new StringValue(notes),
    })

    return activity.map((a) => a.toDTO())
  }

  prospectReassignSupportUser = async (
    _parent: unknown,
    { prospectId, supportUserId, notes }: MutationProspectReassignSupportUserArgs,
    context: ApiContext,
  ): Promise<DTO<ProspectActivityEntity[]>> => {
    const prospectService = container.get<AbstractProspectService>(DI.ProspectService)

    const prospect = await prospectService.reassignSupportUser({
      userId: context.userId,
      prospectId: new UUID(prospectId),
      supportUserId: new UserId(supportUserId),
      notes: notes ? new StringValue(notes) : undefined,
    })

    const prospectRepository = container.get<ProspectRepository>(DI.ProspectRepository)
    const activity = await prospectRepository.getActivity(prospect.getId())

    return activity.map((a) => a.toDTO())
  }

  prospectById = async (_parent: unknown, { prospectId }: QueryProspectByIdArgs): Promise<DTO<ProspectEntity>> => {
    const prospectService = container.get<AbstractProspectService>(DI.ProspectService)
    const prospect = await prospectService.getById(new UUID(prospectId))
    if (!prospect) {
      throw new NotFoundError('Prospect not found')
    }

    return prospect.toDTO()
  }

  prospectActivity = async (
    _parent: unknown,
    { prospectId }: QueryProspectByIdArgs,
  ): Promise<DTO<ProspectActivityEntity[]>> => {
    const prospectRepository = container.get<ProspectRepository>(DI.ProspectRepository)
    const activity = await prospectRepository.getActivity(new UUID(prospectId))

    return activity.map((a) => a.toDTO())
  }

  getAvailableProspectStatusList = async (
    _parent: unknown,
    { prospectId }: QueryProspectByIdArgs,
  ): Promise<DTO<ProspectStatusEntity[]>> => {
    const prospectService = container.get<AbstractProspectService>(DI.ProspectService)
    const prospectStatusList = await prospectService.getAvailableProspectStatusList(
      prospectId ? new UUID(prospectId) : undefined,
    )

    return prospectStatusList.map((a) => a.toDTO())
  }
}
