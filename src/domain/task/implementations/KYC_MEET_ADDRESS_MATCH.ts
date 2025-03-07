import { ChecklistId } from '@domain/checklist/models/ChecklistId'
import { TaskTypeConfig } from '../TaskManager'
import { DispatchValidationError } from '../models/DispatchValidationError'
import { TaskType } from '../models/TaskType'

export const KYC_MEET_ADDRESS_MATCH: TaskTypeConfig = {
  accept: async (args, services) => {
    const application = args.task.getApplication()
    if (!application) throw new DispatchValidationError('Application inexistent or inactive')

    await services.applicationChecklistService.complete({
      userId: args.userId,
      applicationId: application.getId(),
      prospectId: application.getProspectId(),
      checklistId: ChecklistId.KYC_MEET_LIVE,
    })

    return true
  },
  decline: async (args, services) => {
    const application = args.task.getApplication()
    if (!application) throw new DispatchValidationError('Application inexistent or inactive')

    await services.taskService.create({
      taskTypeId: TaskType.KYC_ADDRESS_INPUT,
      applicationId: application.getId(),
      assignedUserId: application.getUserId(),
      applicationChecklistId: args.task.getApplicationChecklistId(),
      originTaskId: args.task.getId(),
    })

    await services.taskService.create({
      taskTypeId: TaskType.KYC_MEET_PICK_DATE,
      applicationId: application.getId(),
      assignedUserId: application.getUserId(),
      applicationChecklistId: args.task.getApplicationChecklistId(),
      originTaskId: args.task.getId(),
    })

    return true
  },
}
