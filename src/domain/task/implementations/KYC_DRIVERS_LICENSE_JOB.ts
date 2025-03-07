import { ChecklistId } from '@domain/checklist/models/ChecklistId'
import { TaskManager, TaskTypeConfig } from '../TaskManager'
import { DispatchValidationError } from '../models/DispatchValidationError'
import container from '@infrastructure/inversify.config'
import ApplicationRepository from '@domain/application/ApplicationRepository'
import { DI } from '@infrastructure'
import { TaskType } from '../models/TaskType'

export const KYC_DRIVERS_LICENSE_JOB: TaskTypeConfig = {
  accept: async (args, services) => {
    const application = args.task.getApplication()
    if (!application) throw new DispatchValidationError('Application inexistent or inactive')

    const contentKey = TaskManager.getContentKeyFromTaskMetadata(args.metadata)
    if (contentKey) {
      application.setDriversLicense(contentKey)

      const applicationRepository = container.get<ApplicationRepository>(DI.ApplicationRepository)
      await applicationRepository.save(application)
    }

    await services.applicationChecklistService.complete({
      userId: args.userId,
      applicationId: application.getId(),
      prospectId: application.getProspectId(),
      checklistId: ChecklistId.DRIVERS_LICENSE,
    })

    return true
  },
  decline: async (args, services) => {
    const application = args.task.getApplication()
    if (!application) throw new DispatchValidationError('Application inexistent or inactive')

    await services.taskService.create({
      taskTypeId: TaskType.KYC_DRIVERS_LICENSE_UPLOAD,
      applicationId: application.getId(),
      assignedUserId: application.getUserId(),
      applicationChecklistId: args.task.getApplicationChecklistId(),
      originTaskId: args.task.getId(),
    })

    return true
  },
}
