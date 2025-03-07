import { GroupId } from '@domain/user/models/GroupId'
import { ChecklistConfig } from '../interfaces/ChecklistConfig'
import { TaskType } from '@domain/task/models/TaskType'

export const VEHICLE_STREET_TAG: ChecklistConfig = {
  onStart: async (args, services) => {
    //await services.taskService.create(
    //  {
    //   taskTypeId: TaskType.VEHICLE_STREET_TAG_INSTALLATION,
    // applicationId: args.applicationId,
    //   applicationChecklistId: args.applicationChecklistId,
    //  },
    //[GroupId.BACKOFFICE],
    //  )

    return true
  },
}
