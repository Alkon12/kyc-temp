import { GroupId } from '@domain/user/models/GroupId'
import { ChecklistConfig } from '../interfaces/ChecklistConfig'
import { TaskType } from '@domain/task/models/TaskType'

export const UBER_DRIVER: ChecklistConfig = {
  onStart: async (args, services) => {
    await services.taskService.create(
      {
        taskTypeId: TaskType.UBER_DRIVER_CONTRACT,
        applicationId: args.applicationId,
        applicationChecklistId: args.applicationChecklistId,
      },
      [GroupId.BACKOFFICE],
    )

    return true
  },
}
