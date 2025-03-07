import { ChecklistId } from '@domain/checklist/models/ChecklistId'
import { TaskTypeConfig } from '../TaskManager'
import { DispatchValidationError } from '../models/DispatchValidationError'

export const VEHICLE_TRACKER_SIM: TaskTypeConfig = {
  accept: async (args, services) => {
    const application = args.task.getApplication()
    if (!application) throw new DispatchValidationError('Application inexistent or inactive')

    //await services.applicationChecklistService.complete({
    //  userId: args.userId,
    //  applicationId: application.getId(),
    //  prospectId: application.getProspectId(),
    //  checklistId: ChecklistId.VEHICLE_TRACKER,
    //})

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
