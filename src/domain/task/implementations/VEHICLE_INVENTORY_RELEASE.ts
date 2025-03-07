import ApplicationRepository from '@domain/application/ApplicationRepository'
import { TaskTypeConfig } from '../TaskManager'
import { DispatchValidationError } from '../models/DispatchValidationError'
import { TaskType } from '../models/TaskType'
import { GroupId } from '@domain/user/models/GroupId'
import { DI } from '@infrastructure'
import container from '@infrastructure/inversify.config'

export const VEHICLE_INVENTORY_RELEASE: TaskTypeConfig = {
  accept: async (args, services) => {
    const application = args.task.getApplication()
    if (!application) throw new DispatchValidationError('Application inexistent or inactive')

    // await services.taskService.create(
    //  {
    //    taskTypeId: TaskType.VEHICLE_INVENTORY_RESERVE,
    //    applicationId: application.getId(),
    //    applicationChecklistId: args.task.getApplicationChecklistId(),
    //   originTaskId: args.task.getId(),
    // },
    // [GroupId.BACKOFFICE],
    // )

    const applicationRepository = container.get<ApplicationRepository>(DI.ApplicationRepository)
    await applicationRepository.clearVehicle(application.getId())

    return true
  },
}
