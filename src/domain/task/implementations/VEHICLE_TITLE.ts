import { ChecklistId } from '@domain/checklist/models/ChecklistId'
import { TaskTypeConfig } from '../TaskManager'
import { DispatchValidationError } from '../models/DispatchValidationError'
import { TaskType } from '../models/TaskType'
import { GroupId } from '@domain/user/models/GroupId'

export const VEHICLE_TITLE: TaskTypeConfig = {
  accept: async (args, services) => {
    // const application = args.task.getApplication()
    // if(!application) throw new DispatchValidationError('Application inexistent or inactive')

    // await services.applicationChecklistService.complete({
    //     userId: args.userId,
    //     applicationId: application.getId(),
    //     checklistId: ChecklistId.TAX_IDENTIFICATION_VERIFICATION,
    // })

    return true
  },
  decline: async (args, services) => {
    const application = args.task.getApplication()
    if (!application) throw new DispatchValidationError('Application inexistent or inactive')

    // await services.taskService.create({
    //     taskTypeId: TaskType.KYC_TAX_IDENTIFICATION_UPLOAD,
    //     applicationId: application.getId(),
    //     assignedUserId: application.getUserId(),
    //     applicationChecklistId: args.task.getApplicationChecklistId()
    // })

    return true
  },
}
