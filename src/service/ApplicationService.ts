import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import { ApplicationEntity, ApplicationEntityProps } from '@domain/application/ApplicationEntity'
import { ApplicationFactory } from '@domain/application/ApplicationFactory'
import type ApplicationRepository from '@domain/application/ApplicationRepository'
import AbstractApplicationService from '@domain/application/ApplicationService'
import { UUID } from '@domain/shared/UUID'
import type OfferRepository from '@domain/offer/OfferRepository'
import { UnexpectedError } from '@domain/error'
import { ScoringResolution } from '@domain/scoring/models/ScoringResolution'
import { CreateApplicationResponse } from '@domain/application/interfaces/CreateApplicationResponse'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { ApplicationChecklistService } from './ApplicationChecklistService'
import { UserId } from '@domain/user/models/UserId'
import { StringValue } from '@domain/shared/StringValue'
import AbstractProspectService from '@domain/prospect/ProspectService'
import { ProspectActivityTypeId } from '@domain/prospect/models/ProspectActivityTypeId'
import { ProspectStatusId } from '@domain/prospect/models/ProspectStatusId'
import AbstractUserService from '@domain/user/UserService'

@injectable()
export class ApplicationService implements AbstractApplicationService {
  @inject(DI.ApplicationRepository)
  private readonly _applicationRepository!: ApplicationRepository
  @inject(DI.OfferRepository)
  private readonly _offerRepository!: OfferRepository
  @inject(DI.ApplicationChecklistService)
  private _applicationChecklistService!: ApplicationChecklistService
  @inject(DI.ProspectService)
  private _prospectService!: AbstractProspectService
  @inject(DI.UserService)
  private readonly _userService!: AbstractUserService

  async getActive(): Promise<ApplicationEntity[]> {
    return this._applicationRepository.getAll()
  }

  async getActiveByUser(userId: UserId): Promise<ApplicationEntity | null> {
    const userApplications = await this._applicationRepository.getByUser(userId)

    const activeApplication = userApplications.find((a) => a.isActive())

    if (activeApplication) {
      return this._applicationRepository.getById(activeApplication?.getId())
    }

    return null
  }

  async create(props: DTO<Partial<ApplicationEntityProps>>): Promise<CreateApplicationResponse> {
    const offer = await this._offerRepository.getById(new UUID(props.offerId))
    if (!offer) {
      throw new UnexpectedError('Offer to create application not found')
    }

    const userId = offer.getUserId()
    const prospectId = offer.getQuote()?.getProspectId()

    if (!prospectId) {
      throw new UnexpectedError('Prospect not found')
    }

    const prepareApplication = ApplicationFactory.create({
      offerId: offer.getId(),
      productId: offer.getProductId(),
      userId,
      quoteId: offer.getQuoteId(),
      prospectId,
      friendlyId: new StringValue(this._generateFriendlyId()),
    })
    const application = await this._applicationRepository.create(prepareApplication)

    await this._applicationChecklistService.generateApplicationChecklistSchema(application.getId())

    await this._applicationChecklistService.startUnlockedChecklistItems(offer.getUserId(), application.getId())

    const updatedApplication = await this._applicationRepository.getById(application.getId())
    if (!updatedApplication) {
      throw new UnexpectedError('Problem fetching just created application')
    }

    await this._prospectService.setActiveApplication(prospectId, application.getId())

    await this._prospectService.logActivity({
      userId,
      prospectId,
      prospectActivityTypeId: ProspectActivityTypeId.APPLICATION_CREATED,
      notes: new StringValue(
        `Oferta: ${offer.getProduct()?.getBrand().toDTO()} ${offer.getProduct()?.getModel().toDTO()} ${offer.getProduct()?.getVersion()?.toDTO()}`,
      ),
    })

    return {
      application: updatedApplication,
      flowStatus: updatedApplication?.getOffer()?.getScoringResolution() ?? ScoringResolution.REJECT,
    }
  }

  async getById(applicationId: UUID): Promise<ApplicationEntity> {
    return this._applicationRepository.getById(applicationId)
  }

  async getAll(): Promise<ApplicationEntity[]> {
    return this._applicationRepository.getAll()
  }

  async markKycAsComplete(applicationId: UUID): Promise<ApplicationEntity> {
    const application = await this._applicationRepository.getById(applicationId)
    if (!application) {
      throw new UnexpectedError('Problem fetching the application')
    }

    application.markKycAsComplete()
    this._applicationRepository.save(application)

    return application
  }

  async markAsComplete(applicationId: DTO<UUID>): Promise<ApplicationEntity> {
    const application = await this._applicationRepository.getById(new UUID(applicationId))
    if (!application) {
      throw new UnexpectedError('Problem fetching the application')
    }

    application.markAsComplete()
    this._applicationRepository.save(application)

    return application
  }

  async revoke(applicationId: UUID): Promise<BooleanValue> {
    const application = await this._applicationRepository.getById(applicationId)
    if (!application) {
      throw new UnexpectedError('Problem fetching the application')
    }

    application.revoke()
    this._applicationRepository.save(application)

    await this._prospectService.setActiveApplication(application.getProspectId())

    return new BooleanValue(true)
  }

  async expire(applicationId: DTO<UUID>): Promise<ApplicationEntity> {
    const systemUser = await this._userService.getSystemUser()

    const application = await this._applicationRepository.getById(new UUID(applicationId))
    if (!application) {
      throw new UnexpectedError('Problem fetching the application')
    }

    application.expire()
    this._applicationRepository.save(application)

    await this._prospectService.setActiveApplication(application.getProspectId())

    await this._prospectService.updateStatus({
      userId: systemUser.getId(),
      prospectId: application.getProspectId(),
      prospectStatusId: ProspectStatusId.APPLICATION_EXPIRED,
    })

    return application
  }

  private _generateFriendlyId(): string {
    const millis = Date.now().toString()
    const reduced = millis.slice(millis.length - 8)
    const rand = Math.floor(Math.random() * 100)
    return `SOL-${reduced}${rand}`
  }
}
