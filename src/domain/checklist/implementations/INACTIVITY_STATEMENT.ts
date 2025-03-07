import { GroupId } from '@domain/user/models/GroupId'
import { TaskType } from '@domain/task/models/TaskType'
import { ChecklistConfig } from '../interfaces/ChecklistConfig'

export const INACTIVITY_STATEMENT: ChecklistConfig = {
  onStart: async (args, services) => {
    // We wont use this file upload for the moment
    // await services.taskService.create({
    //     taskTypeId: TaskType.KYC_INACTIVITY_STATEMENT_UPLOAD,
    //     applicationId: args.applicationId,
    //     assignedUserId: args.applicationUserId,
    //     applicationChecklistId: args.applicationChecklistId,
    // })

    await services.taskService.create({
      taskTypeId: TaskType.KYC_INACTIVITY_STATEMENT_INPUT,
      applicationId: args.applicationId,
      assignedUserId: args.applicationUserId,
      applicationChecklistId: args.applicationChecklistId,
    })

    return true
  },
}
