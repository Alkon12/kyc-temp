import { UUID } from '@domain/shared/UUID'
import { UserId } from '@domain/user/models/UserId'

export interface StartChecklistArgs {
  applicationId: UUID
  userId: UserId
  applicationUserId: UserId
  applicationChecklistId: UUID
  prospectId: UUID
}
