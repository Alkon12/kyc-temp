import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'
import { UserId } from '@domain/user/models/UserId'

export type DismissChecklistProps = {
  userId: UserId
  applicationChecklistId: UUID
  message?: StringValue
  prospectId: UUID
}
