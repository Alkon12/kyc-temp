import { GroupId } from '@domain/user/models/GroupId'
import { TaskType } from '@domain/task/models/TaskType'
import { ChecklistConfig } from '../interfaces/ChecklistConfig'

export const ADDRESS: ChecklistConfig = {
  onStart: async (args, services) => {
    await services.taskService.create({
      taskTypeId: TaskType.KYC_ADDRESS_INPUT,
      applicationId: args.applicationId,
      assignedUserId: args.applicationUserId,
      applicationChecklistId: args.applicationChecklistId,
    })

    await services.taskService.create({
      taskTypeId: TaskType.KYC_ADDRESS_PROOF_UPLOAD,
      applicationId: args.applicationId,
      //assignedUserId: args.applicationUserId,
      applicationChecklistId: args.applicationChecklistId,
    })

    return true
  },
}
