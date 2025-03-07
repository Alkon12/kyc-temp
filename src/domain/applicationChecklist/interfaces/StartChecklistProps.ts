import { UUID } from '@domain/shared/UUID'
import { UserId } from '@domain/user/models/UserId'
import { ApplicationChecklistEntity } from '../ApplicationChecklistEntity'

export type StartChecklistProps = {
  userId: UserId
  applicationId: UUID
  applicationUserId: UserId
  applicationChecklist: ApplicationChecklistEntity
  prospectId: UUID
}
