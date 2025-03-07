import ApplicationRepository from '@domain/application/ApplicationRepository'
import { TaskTypeConfig } from '../TaskManager'
import { DispatchValidationError } from '../models/DispatchValidationError'
import { TaskType } from '../models/TaskType'
import { DI } from '@infrastructure'
import container from '@infrastructure/inversify.config'
import { ChecklistId } from '@domain/checklist/models/ChecklistId'

export const KYC_INACTIVITY_STATEMENT_INPUT: TaskTypeConfig = {
  accept: async (args, services) => {
    const application = args.task.getApplication()
    if (!application) throw new DispatchValidationError('Application inexistent or inactive')

    const applicationRepository = container.get<ApplicationRepository>(DI.ApplicationRepository)
    application.markDriverAsEngaged()
    await applicationRepository.save(application)

    await services.applicationChecklistService.complete({
      userId: args.userId,
      applicationId: application.getId(),
      prospectId: application.getProspectId(),
      checklistId: ChecklistId.INACTIVITY_STATEMENT,
    })

    return true
  },
  decline: async (args, services) => {
    const application = args.task.getApplication()
    if (!application) throw new DispatchValidationError('Application inexistent or inactive')

    await services.taskService.create({
      taskTypeId: TaskType.KYC_INACTIVITY_STATEMENT_INPUT,
      applicationId: application.getId(),
      assignedUserId: application.getUserId(),
      applicationChecklistId: args.task.getApplicationChecklistId(),
      originTaskId: args.task.getId(),
    })

    return true
  },
}
