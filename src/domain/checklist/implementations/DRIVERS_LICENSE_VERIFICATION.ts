import { GroupId } from '@domain/user/models/GroupId'
import { TaskType } from '@domain/task/models/TaskType'
import { ChecklistConfig } from '../interfaces/ChecklistConfig'

export const DRIVERS_LICENSE_VERIFICATION: ChecklistConfig = {
  onStart: async (args, services) => {
    await services.taskService.create(
      {
        taskTypeId: TaskType.KYC_DRIVERS_LICENSE_VERIFICATION,
        applicationId: args.applicationId,
        applicationChecklistId: args.applicationChecklistId,
      },
      [GroupId.BACKOFFICE],
    )

    return true
  },
}
