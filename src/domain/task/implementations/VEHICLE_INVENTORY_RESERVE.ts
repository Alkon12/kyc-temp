import { ChecklistId } from '@domain/checklist/models/ChecklistId'
import { TaskTypeConfig } from '../TaskManager'
import { DispatchValidationError } from '../models/DispatchValidationError'
import { TaskType } from '../models/TaskType'
import { GroupId } from '@domain/user/models/GroupId'

export const VEHICLE_INVENTORY_RESERVE: TaskTypeConfig = {
  accept: async (args, services) => {
    const application = args.task.getApplication()
    if (!application) throw new DispatchValidationError('Application inexistent or inactive')

    //await services.taskService.create(
    //  {
    //    taskTypeId: TaskType.VEHICLE_INVENTORY_RELEASE,
    //   applicationId: application.getId(),
    //   applicationChecklistId: args.task.getApplicationChecklistId(),
    //    originTaskId: args.task.getId(),
    // },
    //  [GroupId.BACKOFFICE],
    //)

    await services.applicationChecklistService.complete({
      userId: args.userId,
      applicationId: application.getId(),
      prospectId: application.getProspectId(),
      checklistId: ChecklistId.VEHICLE_INVENTORY,
    })

    return true
  },
}
