import { UUID } from '@domain/shared/UUID'
import { UserId } from '@domain/user/models/UserId'

export interface DismissChecklistArgs {
  applicationId: UUID
  userId: UserId
  prospectId: UUID
}
