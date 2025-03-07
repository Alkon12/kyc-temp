import { GroupId } from '@domain/user/models/GroupId'
import { ChecklistConfig } from '../interfaces/ChecklistConfig'
import { TaskType } from '@domain/task/models/TaskType'

export const SELFIE_PICTURE_VERIFICATION: ChecklistConfig = {
  onStart: async (args, services) => {
    await services.taskService.create(
      {
        taskTypeId: TaskType.KYC_SELFIE_PICTURE_VERIFICATION,
        applicationId: args.applicationId,
        applicationChecklistId: args.applicationChecklistId,
      },
      [GroupId.BACKOFFICE],
    )

    return true
  },
}
