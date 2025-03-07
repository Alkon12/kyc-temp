import container from '@infrastructure/inversify.config'
import { ApplicationService } from '@service/ApplicationService'
import { DI } from '@infrastructure'
import { ChecklistConfig } from '../interfaces/ChecklistConfig'
import { TaskType } from '@domain/task/models/TaskType'
import { GroupId } from '@domain/user/models/GroupId'
import { BooleanValue } from '@domain/shared/BooleanValue'

export const KYC_GOOD_TO_GO: ChecklistConfig = {
  onStart: async (args, services) => {
    await services.taskService.create(
      {
        taskTypeId: TaskType.KYC_FINAL_APPROVAL,
        applicationId: args.applicationId,
        applicationChecklistId: args.applicationChecklistId,
      },
      [GroupId.BACKOFFICE],
    )
    // await services.taskService.create(
    //   {
    //     taskTypeId: TaskType.PAYMENT_RECONCILIATION,
    //     applicationId: args.applicationId,
    //     applicationChecklistId: args.applicationChecklistId,
    //   },
    //   [GroupId.BACKOFFICE],
    // )

    return true
  },
  onComplete: async (args, services) => {
    const applicationService = container.get<ApplicationService>(DI.ApplicationService)
    await applicationService.markKycAsComplete(args.applicationId)

    return true
  },
}
