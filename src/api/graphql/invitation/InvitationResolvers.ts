import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import InvitationService from '@domain/invitation/InvitationService'
import { DI } from '@infrastructure'
import { InvitationEntity } from '@domain/invitation/InvitationEntity'
import { DTO } from '@domain/kernel/DTO'
import {
  QueryInvitationByIdArgs,
  MutationSetInvitationStatusArgs,
  MutationCreateInvitationArgs,
  InvitationOverview,
  MutationAcceptInvitationArgs,
} from '../app.schema.gen'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { UUID } from '@domain/shared/UUID'
import AbstractInvitationService from '@domain/invitation/InvitationService'
import { UserId } from '@domain/user/models/UserId'
import { ApiContext } from '@api/shared/Api'
import { StringValue } from '@domain/shared/StringValue'
import { InvitationFactory } from '@domain/invitation/InvitationFactory'

@injectable()
export class InvitationResolvers {
  build() {
    return {
      Query: {
        invitations: this.invitations,
        myInvitations: this.myInvitations,
        activeInvitations: this.activeInvitations,
        invitationById: this.invitationById,
        invitationOverview: this.invitationOverview,
      },
      Mutation: {
        createInvitation: this.createInvitation,
        acceptInvitation: this.acceptInvitation,
        setInvitationStatus: this.setInvitationStatus,
      },
      Invitation: {
        link: this.resolveInvitationLink,
      },
    }
  }

  invitations = async (_parent: unknown): Promise<DTO<InvitationEntity[]>> => {
    const invitationService = container.get<InvitationService>(DI.InvitationService)
    const invitations = await invitationService.getAll()

    return invitations.map((l) => l.toDTO())
  }

  myInvitations = async (
    _parent: unknown,
    { input }: MutationCreateInvitationArgs,
    context: ApiContext,
  ): Promise<DTO<InvitationEntity[]>> => {
    const invitationService = container.get<InvitationService>(DI.InvitationService)
    const invitations = await invitationService.getByReferrer(context.userId)

    return invitations.map((l) => l.toDTO())
  }

  activeInvitations = async (_parent: unknown): Promise<DTO<InvitationEntity[]>> => {
    const invitationService = container.get<InvitationService>(DI.InvitationService)
    const invitations = await invitationService.getActive()

    return invitations.map((l) => l.toDTO())
  }

  invitationById = async (
    _parent: unknown,
    { invitationId }: QueryInvitationByIdArgs,
  ): Promise<DTO<InvitationEntity | null>> => {
    const invitationService = container.get<InvitationService>(DI.InvitationService)
    const invitation = await invitationService.getById(new UUID(invitationId))
    if (!invitation) {
      return null
    }

    return invitation.toDTO()
  }

  createInvitation = async (
    _parent: unknown,
    { input }: MutationCreateInvitationArgs,
    context: ApiContext,
  ): Promise<DTO<InvitationEntity>> => {
    const invitationProps = {
      email: input.email,
      phoneNumber: input.phoneNumber,
      firstName: input.firstName,
      lastName: input.lastName,
      hasUberAccount: input.hasUberAccount,
      productId: input.productId,
      isOnsite: input.isOnsite,
      referrerId: input.referrerId || context.userId.toDTO(),
      campaignId: input.campaignId,
      branchId: input.branchId,
      promotionId: input.promotionId,
      comments: input.comments,
    }
    const invitationService = container.get<InvitationService>(DI.InvitationService)

    const invitation = await invitationService.create(invitationProps)

    return invitation.toDTO()
  }

  setInvitationStatus = async (
    _parent: unknown,
    { id, status }: MutationSetInvitationStatusArgs,
  ): Promise<DTO<BooleanValue>> => {
    const invitationStatusProps = {
      id,
      status,
    }
    const invitationService = container.get<AbstractInvitationService>(DI.InvitationService)
    const invitation = await invitationService.update(invitationStatusProps)
    return invitation.toDTO()
  }

  invitationOverview = async (): Promise<InvitationOverview> => {
    const invitationService = container.get<AbstractInvitationService>(DI.InvitationService)

    const invitationOverview = await invitationService.overview()

    return invitationOverview
  }

  acceptInvitation = async (
    _parent: unknown,
    { userId, invitationId }: MutationAcceptInvitationArgs,
  ): Promise<DTO<InvitationEntity>> => {
    const invitationService = container.get<AbstractInvitationService>(DI.InvitationService)

    const invitation = await invitationService.accept(new UserId(userId), new UUID(invitationId))

    return invitation.toDTO()
  }

  resolveInvitationLink = async (parent: DTO<InvitationEntity>, _: unknown): Promise<DTO<StringValue>> => {
    const invitation = InvitationFactory.fromDTO(parent)

    return invitation.getLink()
  }
}
