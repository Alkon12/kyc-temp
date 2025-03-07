import { UUID } from '@domain/shared/UUID'
import { ApplicationChecklistEntity } from './ApplicationChecklistEntity'
import { StringValue } from '@domain/shared/StringValue'
import { UserId } from '@domain/user/models/UserId'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { ChecklistId } from '@domain/checklist/models/ChecklistId'
import { CompleteChecklistProps } from './interfaces/CompleteChecklistProps'
import { StartChecklistProps } from './interfaces/StartChecklistProps'

export default abstract class AbstractApplicationChecklistService {
  abstract getApplicationChecklistByApplication(applicationId: UUID): Promise<ApplicationChecklistEntity[]>
  abstract getApplicationChecklist(
    applicationId: UUID,
    parentChecklistId?: ChecklistId,
  ): Promise<ApplicationChecklistEntity[]>
  abstract getApplicationChecklistById(applicationChecklistId: UUID): Promise<ApplicationChecklistEntity>
  abstract dismissApplicationChecklist(
    applicationChecklistId: UUID,
    userId: UserId,
    message?: StringValue,
  ): Promise<ApplicationChecklistEntity>
  abstract generateApplicationChecklistSchema(applicationId: UUID): Promise<BooleanValue>
  abstract startUnlockedChecklistItems(userId: UserId, applicationId: UUID): Promise<BooleanValue>
  abstract completeInheritedChecklistItems(userId: UserId, applicationId: UUID): Promise<BooleanValue>
  abstract complete(props: CompleteChecklistProps): Promise<BooleanValue>
  abstract start(props: StartChecklistProps): Promise<BooleanValue>
  abstract getApplicationChecklistByApplicationAndChecklistId(
    applicationId: UUID,
    checklistId: ChecklistId,
  ): Promise<ApplicationChecklistEntity>
}
