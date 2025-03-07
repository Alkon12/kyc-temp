import { TaskTypeConfig } from '../TaskManager'
import { DispatchValidationError } from '../models/DispatchValidationError'
import ApplicationRepository from '@domain/application/ApplicationRepository'
import { DI } from '@infrastructure'
import container from '@infrastructure/inversify.config'

export const KYC_DRIVERS_LICENSE_UPLOAD: TaskTypeConfig = {
  accept: async (args, services) => {
    const application = args.task.getApplication()
    if (!application) throw new DispatchValidationError('Application inexistent or inactive')

    const applicationRepository = container.get<ApplicationRepository>(DI.ApplicationRepository)
    application.markDriverAsEngaged()
    await applicationRepository.save(application)

    return true
  },
}
