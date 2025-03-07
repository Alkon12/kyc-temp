import { UUID } from '@domain/shared/UUID'
import { ApplicationChecklistEntity } from './ApplicationChecklistEntity'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { ChecklistId } from '@domain/checklist/models/ChecklistId'
import { ChecklistEntity } from '@domain/checklist/ChecklistEntity'
import { UserId } from '@domain/user/models/UserId'
import { NumberValue } from '@domain/shared/NumberValue'

export type CreateApplicationChecklistProps = {
  applicationId: UUID
  checklist: ChecklistEntity
  parentApplicationChecklistId?: UUID
  order?: NumberValue
}

export default interface ApplicationChecklistRepository {
  markApplicationChecklistAsStarted(applicationChecklistId: UUID): Promise<BooleanValue>
  markApplicationChecklistAsDismissed(applicationChecklistId: UUID, userId: UserId): Promise<BooleanValue>
  markChecklistItemAsComplete(applicationId: UUID, checklistId: ChecklistId): Promise<BooleanValue>
  getChecklistById(checklistId: ChecklistId): Promise<ChecklistEntity>
  getApplicationChecklistByApplicationAndChecklistId(
    applicationId: UUID,
    checklistId: ChecklistId,
  ): Promise<ApplicationChecklistEntity | null>
  getApplicationChecklistByApplication(applicationId: UUID): Promise<ApplicationChecklistEntity[]>
  getApplicationChecklistById(applicationChecklistId: UUID): Promise<ApplicationChecklistEntity>
  createApplicationChecklist(props: CreateApplicationChecklistProps): Promise<ApplicationChecklistEntity>
  getDefaultChecklist(): Promise<ChecklistEntity[]>
  saveApplicationChecklist(applicationChecklist: ApplicationChecklistEntity): Promise<ApplicationChecklistEntity>
}
