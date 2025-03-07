import { ChecklistId } from '@domain/checklist/models/ChecklistId'
import { UUID } from '@domain/shared/UUID'
import { UserId } from '@domain/user/models/UserId'

export type CompleteChecklistProps = {
  userId: UserId
  applicationId: UUID
  checklistId: ChecklistId
  prospectId: UUID
}
