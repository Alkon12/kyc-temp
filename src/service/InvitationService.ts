import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import { InvitationEntity, InvitationEntityProps } from '@domain/invitation/InvitationEntity'
import { InvitationFactory } from '@domain/invitation/InvitationFactory'
import type InvitationRepository from '@domain/invitation/InvitationRepository'
import { BooleanValue } from '@domain/shared/BooleanValue'
import AbstractInvitationService from '@domain/invitation/InvitationService'
import { UUID } from '@domain/shared/UUID'
import { CreateInvitationArgs } from '@domain/invitation/interfaces/CreateInvitationArgs'
import { StringValue } from '@domain/shared/StringValue'
import { PhoneNumber } from '@domain/shared/PhoneNumber'
import { Email } from '@domain/shared/Email'
import { InvitationStatus } from '@domain/invitation/InvitationStatus'
import {
  InvitationOverviewCountRefineResponse,
  InvitationOverviewResponse,
} from '@domain/invitation/interfaces/InvitationOverviewResponse'
import { OverviewCount } from '@domain/shared/OverviewCount'
import { type UberService } from '@/application/service/UberService'
import { UserId } from '@domain/user/models/UserId'
import { CampaignId } from '@domain/shared/CampaignId'
import { BranchId } from '@domain/shared/BranchId'
import { PromotionId } from '@domain/shared/PromotionId'
import { UnexpectedError } from '@domain/error'
import { QuoteService } from './QuoteService'
import { ProspectService } from './ProspectService'
import { type NotificationService } from '@/application/service/NotificationService'
import { NotificationChannel } from '@domain/shared/NotificationChannel'
import { ApplicationService } from './ApplicationService'

@injectable()
export class InvitationService implements AbstractInvitationService {
  @inject(DI.InvitationRepository) private readonly _invitationRepository!: InvitationRepository
  @inject(DI.UberService) private readonly _uberService!: UberService
  @inject(DI.QuoteService) private readonly _quoteService!: QuoteService
  @inject(DI.ProspectService) private readonly _prospectService!: ProspectService
  @inject(DI.NotificationService) private _notificationService!: NotificationService
  @inject(DI.ApplicationService) private _applicationService!: ApplicationService

  async create(props: DTO<CreateInvitationArgs>): Promise<InvitationEntity> {
    const prepareInvitation = InvitationFactory.create({
      email: props.email ? new Email(props.email) : undefined,
      firstName: props.firstName ? new StringValue(props.firstName) : undefined,
      lastName: props.lastName ? new StringValue(props.lastName) : undefined,
      phoneNumber: props.phoneNumber ? new PhoneNumber(props.phoneNumber) : undefined,
      hasUberAccount: props.hasUberAccount ? new BooleanValue(props.hasUberAccount) : undefined,
      productId: props.productId ? new UUID(props.productId) : undefined,
      isOnsite: props.isOnsite ? new BooleanValue(props.isOnsite) : undefined,
      referrerId: props.referrerId ? new UserId(props.referrerId) : undefined,
      campaignId: props.campaignId ? new CampaignId(props.campaignId) : undefined,
      branchId: props.branchId ? new BranchId(props.branchId) : undefined,
      promotionId: props.promotionId ? new PromotionId(props.promotionId) : undefined,
      comments: props.comments ? new StringValue(props.comments) : undefined,
      status: InvitationStatus.CREATED,
    })

    // let hasUberAccount = false

    // const invitationEmail = prepareInvitation.getEmail()
    // const invitationPhoneNumber = prepareInvitation.getPhoneNumber()

    // if (invitationEmail) {
    //   const foundEmailInUber = await this._uberService.searchDriverByEmail(invitationEmail.toDTO())
    //   if (foundEmailInUber) {
    //     hasUberAccount = true
    //   }
    // }

    // if (invitationPhoneNumber && !hasUberAccount) {
    //   const phone = invitationPhoneNumber.getCountryCodeNumber()

    //   const foundPhoneNumberInUber = await this._uberService.searchDriverByPhoneNumber(
    //     invitationPhoneNumber.toDTO(),
    //     invitationPhoneNumber.toDTO(),
    //   )
    //   if (foundPhoneNumberInUber) {
    //     hasUberAccount = true
    //   }
    // }

    // prepareInvitation.setHasUberAccount(hasUberAccount)

    const invitation = await this._invitationRepository.create(prepareInvitation)

    await this._notificationService.send(
      {
        phoneNumber: invitation.getPhoneNumber(),
        email: invitation.getEmail(),
        firstName: invitation.getFirstName(),
        lastName: invitation.getLastName(),
      },
      {
        channel: [NotificationChannel.EMAIL],
        title: new StringValue('Estás muy cerca de tu auto!'),
        content: new StringValue(`Seguí el proceso haciendo con este link: ${invitation.getLink()}`),
      },
    )

    return invitation
  }

  async update(props: DTO<InvitationEntityProps>): Promise<BooleanValue> {
    const invitation = InvitationFactory.fromDTO(props)
    return this._invitationRepository.update(invitation)
  }

  async getAll(): Promise<InvitationEntity[]> {
    return this._invitationRepository.getAll()
  }

  async getByReferrer(userId: UserId): Promise<InvitationEntity[]> {
    return this._invitationRepository.getByReferrer(userId)
  }

  async getActive(): Promise<InvitationEntity[]> {
    const invitations = await this._invitationRepository.getAll()

    return invitations.filter((l) => !l.isExpired() && !l.isAccepted())
  }

  async getById(invitationId: UUID): Promise<InvitationEntity | null> {
    return this._invitationRepository.getById(invitationId)
  }

  async overview(): Promise<InvitationOverviewResponse> {
    // TODO remove invitations with users
    const invitations = await this._invitationRepository.getAll()

    return {
      withUberAccount: this._getCountRefine(invitations.filter((l) => l.hasUberAccount())),
      withoutUberAccount: this._getCountRefine(invitations.filter((l) => !l.hasUberAccount())),
    }
  }

  async accept(userId: UserId, invitationId: UUID): Promise<InvitationEntity> {
    const invitation = await this.getById(invitationId)

    if (!invitation) {
      throw new UnexpectedError('Invitation not found')
    }

    const prospect = await this._prospectService.getOrCreate({
      userId,
      supportUserId: invitation.getReferrerId(),
      // invitationId: invitation.getId(),
    })

    const quote = await this._quoteService.create({
      userId: userId.toDTO(),
    })

    // TODO check quote errors

    invitation.setStatus(InvitationStatus.ACCEPTED)
    invitation.setProspectId(prospect.getId())
    invitation.setQuoteId(quote.getId())
    this._invitationRepository.update(invitation)

    if (quote) {
      const productId = invitation.getProductId()
      const offers = quote.getOffers()
      const matchedProductOffer = productId && offers?.find((o) => o.getProductId().sameValueAs(productId))

      if (matchedProductOffer) {
        this._applicationService.create({
          offerId: matchedProductOffer.getId().toDTO(),
        })
      } else if (offers && offers.length > 0) {
        this._applicationService.create({
          offerId: offers[0].getId().toDTO(),
        })
      } else {
        // TODO back with quote created but no offers to the user
      }
    }

    return invitation
  }

  _getCountRefine = (invitations: InvitationEntity[]): InvitationOverviewCountRefineResponse => {
    const created = invitations.length
    const sent = invitations.filter((l) => l.isSent()).length
    const accepted = invitations.filter((l) => l.isAccepted()).length
    const expired = invitations.filter((l) => l.isExpired()).length

    return {
      created: new OverviewCount(created).toDTO(),
      sent: new OverviewCount(sent).toDTO(),
      accepted: new OverviewCount(accepted).toDTO(),
      expired: new OverviewCount(expired).toDTO(),
    }
  }
}
