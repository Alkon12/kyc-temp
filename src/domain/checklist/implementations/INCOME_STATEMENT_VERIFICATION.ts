import { GroupId } from '@domain/user/models/GroupId'
import { TaskType } from '@domain/task/models/TaskType'
import { ChecklistConfig } from '../interfaces/ChecklistConfig'

export const INCOME_STATEMENT_VERIFICATION: ChecklistConfig = {
  onStart: async (args, services) => {
    await services.taskService.create(
      {
        taskTypeId: TaskType.KYC_INCOME_STATEMENT_VERIFICATION,
        applicationId: args.applicationId,
        applicationChecklistId: args.applicationChecklistId,
      },
      [GroupId.BACKOFFICE],
    )

    return true
  },
}
