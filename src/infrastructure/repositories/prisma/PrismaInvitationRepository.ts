import prisma from '@client/providers/PrismaClient'
import InvitationRepository from '@/domain/invitation/InvitationRepository'
import { InvitationEntity } from '@/domain/invitation/InvitationEntity'
import { BooleanValue } from '@/domain/shared/BooleanValue'
import { injectable } from 'inversify'
import { InvitationFactory } from '@domain/invitation/InvitationFactory'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { UUID } from '@domain/shared/UUID'
import { InvitationStatus } from '@domain/invitation/InvitationStatus'
import { UnexpectedError } from '@domain/error'
import { UserId } from '@domain/user/models/UserId'

@injectable()
export class PrismaInvitationRepository implements InvitationRepository {
  async create(invitation: InvitationEntity): Promise<InvitationEntity> {
    console.log('Invitation Create', invitation)

    try {
      const el = await prisma.invitation.create({
        data: {
          ...invitation.toDTO(),
          product: undefined,
          branch: undefined,
          campaign: undefined,
          promotion: undefined,
          referrer: undefined,
          prospect: undefined,
          quote: undefined,
          application: undefined,
          status: InvitationStatus.CREATED.toDTO(),
        },
      })

      return InvitationFactory.fromDTO(convertPrismaToDTO<InvitationEntity>(el))
    } catch (e) {
      console.error(e)
      throw new UnexpectedError('Repo error al crear invitación')
    }
  }

  async update(data: InvitationEntity): Promise<BooleanValue> {
    try {
      const dto = { ...data.toDTO() }
      const id = dto.id

      await prisma.invitation.update({
        where: { id },
        data: {
          ...dto,
          product: undefined,
          branch: undefined,
          campaign: undefined,
          promotion: undefined,
          referrer: undefined,
          prospect: undefined,
          quote: undefined,
          application: undefined,
        },
      })
      return new BooleanValue(true)
    } catch (e) {
      console.error(e)
      return new BooleanValue(false)
    }
  }

  async getAll(): Promise<InvitationEntity[]> {
    const invitations = await prisma.invitation.findMany({
      include: {
        product: true,
        branch: true,
        campaign: true,
        promotion: true,
        referrer: true,
        prospect: {
          include: {
            prospectStatus: true,
          },
        },
        quote: true,
        application: true,
      },
    })

    return invitations.map((invitation) => InvitationFactory.fromDTO(convertPrismaToDTO<InvitationEntity>(invitation)))
  }

  async getByReferrer(userId: UserId): Promise<InvitationEntity[]> {
    const invitations = await prisma.invitation.findMany({
      where: {
        referrerId: userId.toDTO(),
      },
      include: {
        product: true,
        branch: true,
        campaign: true,
        promotion: true,
        referrer: true,
        prospect: {
          include: {
            prospectStatus: true,
          },
        },
        quote: true,
        application: true,
      },
    })

    return invitations.map((invitation) => InvitationFactory.fromDTO(convertPrismaToDTO<InvitationEntity>(invitation)))
  }

  async getById(invitationId: UUID): Promise<InvitationEntity | null> {
    const invitation = await prisma.invitation.findUnique({
      where: {
        id: invitationId.toDTO(),
      },
      include: {
        product: true,
        branch: true,
        campaign: true,
        promotion: true,
        referrer: true,
        prospect: {
          include: {
            prospectStatus: true,
          },
        },
        quote: true,
        application: true,
      },
    })

    if (!invitation) {
      return null
    }

    return InvitationFactory.fromDTO(convertPrismaToDTO<InvitationEntity>(invitation))
  }
}
