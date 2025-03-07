import { BooleanValue } from '@domain/shared/BooleanValue'
import { InvitationEntity, InvitationEntityProps } from './InvitationEntity'
import { DTO } from '@domain/kernel/DTO'
import { UUID } from '@domain/shared/UUID'
import { CreateInvitationArgs } from './interfaces/CreateInvitationArgs'
import { InvitationOverviewResponse } from './interfaces/InvitationOverviewResponse'
import { UserId } from '@domain/user/models/UserId'

export default abstract class AbstractInvitationService {
  abstract create(props: DTO<CreateInvitationArgs>): Promise<InvitationEntity>
  abstract update(props: DTO<InvitationEntityProps>): Promise<BooleanValue>
  abstract getAll(): Promise<InvitationEntity[]>
  abstract getByReferrer(userId: UserId): Promise<InvitationEntity[]>
  abstract getActive(): Promise<InvitationEntity[]>
  abstract getById(invitationId: UUID): Promise<InvitationEntity | null>
  abstract overview(): Promise<InvitationOverviewResponse>
  abstract accept(userId: UserId, invitationId: UUID): Promise<InvitationEntity>
}
