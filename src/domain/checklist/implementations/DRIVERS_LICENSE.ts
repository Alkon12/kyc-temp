import { GroupId } from '@domain/user/models/GroupId'
import { TaskType } from '@domain/task/models/TaskType'
import { ChecklistConfig } from '../interfaces/ChecklistConfig'
import { BooleanValue } from '@domain/shared/BooleanValue'

export const DRIVERS_LICENSE: ChecklistConfig = {
  onStart: async (args, services) => {
    await services.taskService.create({
      taskTypeId: TaskType.KYC_DRIVERS_LICENSE_UPLOAD,
      applicationId: args.applicationId,
      assignedUserId: args.applicationUserId,
      applicationChecklistId: args.applicationChecklistId,
    })

    await services.taskService.create({
      taskTypeId: TaskType.KYC_DRIVERS_LICENSE_REVERSE_UPLOAD,
      applicationId: args.applicationId,
      assignedUserId: undefined, // TODO: Asing to user, must sync with app
      applicationChecklistId: args.applicationChecklistId,
      optional: new BooleanValue(true)
    })

    return true
  },
}
