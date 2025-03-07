import { GroupId } from '@domain/user/models/GroupId'
import { ChecklistConfig } from '../interfaces/ChecklistConfig'
import { TaskType } from '@domain/task/models/TaskType'
import container from '@infrastructure/inversify.config'
import { ApplicationService } from '@service/ApplicationService'
import { DI } from '@infrastructure'
import { ProspectStatusId } from '@domain/prospect/models/ProspectStatusId'
import { ProspectActivityTypeId } from '@domain/prospect/models/ProspectActivityTypeId'

export const ONBOARD_BACKOFFICE_APPROVAL: ChecklistConfig = {
  onStart: async (args, services) => {
    const applicationService = container.get<ApplicationService>(DI.ApplicationService)
    const application = await applicationService.getById(args.applicationId)

    services.taskService.create(
      {
        taskTypeId: TaskType.APPLICATION_BACKOFFICE_APPROVAL,
        applicationId: args.applicationId,
        quoteId: application.getQuoteId(),
        offerId: application.getOfferId(),
        productId: application.getProductId(),
        applicationChecklistId: args.applicationChecklistId,
      },
      [GroupId.BACKOFFICE],
    )

    const systemUser = await services.userService.getSystemUser()

    await services.prospectService.logActivity({
      userId: systemUser.getId(),
      prospectId: args.prospectId,
      prospectActivityTypeId: ProspectActivityTypeId.APPLICATION_PREAPPROVAL_REQUESTED,
    })

    await services.prospectService.updateStatus({
      userId: systemUser.getId(),
      prospectId: args.prospectId,
      prospectStatusId: ProspectStatusId.APPLICATION_AWAITING_PREAPPROVAL,
    })

    return true
  },
}
