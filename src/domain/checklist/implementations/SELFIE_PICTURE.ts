import { GroupId } from '@domain/user/models/GroupId'
import { ChecklistConfig } from '../interfaces/ChecklistConfig'
import { TaskType } from '@domain/task/models/TaskType'

export const SELFIE_PICTURE: ChecklistConfig = {
  onStart: async (args, services) => {
    await services.taskService.create({
      taskTypeId: TaskType.KYC_SELFIE_PICTURE_UPLOAD,
      applicationId: args.applicationId,
      assignedUserId: args.applicationUserId,
      applicationChecklistId: args.applicationChecklistId,
    })

    return true
  },
}
