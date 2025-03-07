import { ChecklistId } from '@domain/checklist/models/ChecklistId'
import { TaskTypeConfig } from '../TaskManager'
import { DispatchValidationError } from '../models/DispatchValidationError'
import ApplicationRepository from '@domain/application/ApplicationRepository'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'

export const KYC_IDENTIFICATION_CARD_UPLOAD: TaskTypeConfig = {
  accept: async (args, services) => {
    const application = args.task.getApplication()
    if (!application) throw new DispatchValidationError('Application inexistent or inactive')

    const applicationRepository = container.get<ApplicationRepository>(DI.ApplicationRepository)
    application.markDriverAsEngaged()
    await applicationRepository.save(application)

    return true
  },
}
