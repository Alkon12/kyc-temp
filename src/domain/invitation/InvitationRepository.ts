import { InvitationEntity } from '@/domain/invitation/InvitationEntity'
import { BooleanValue } from '../shared/BooleanValue'
import { UUID } from '@domain/shared/UUID'
import { UserId } from '@domain/user/models/UserId'

export default interface InvitationRepository {
  create(data: InvitationEntity): Promise<InvitationEntity>
  update(data: InvitationEntity): Promise<BooleanValue>
  getAll(): Promise<InvitationEntity[]>
  getByReferrer(userId: UserId): Promise<InvitationEntity[]>
  getById(invitationId: UUID): Promise<InvitationEntity | null>
}
