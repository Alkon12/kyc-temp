import { ProspectActivityTypeId } from '@domain/prospect/models/ProspectActivityTypeId'
import { TaskTypeConfig } from '../TaskManager'
import { DispatchValidationError } from '../models/DispatchValidationError'
import { ProspectStatusId } from '@domain/prospect/models/ProspectStatusId'
import { TaskType } from '@domain/task/models/TaskType'
import { GroupId } from '@domain/user/models/GroupId'
import { BooleanValue } from '@domain/shared/BooleanValue'

export const KYC_FINAL_APPROVAL: TaskTypeConfig = {
  validation: (args, services) => {
    const application = args.task.getApplication()
    if (!application) return new DispatchValidationError('Application inexistent or inactive')
    if (!application.getQuote()?.getScoringComplete())
      return new DispatchValidationError('Quote with scoring incomplete')

    return null
  },
  accept: async (args, services) => {
    const application = args.task.getApplication()
    if (!application) throw new DispatchValidationError('Application inexistent or inactive')
    
      
    await services.prospectService.logActivity({
      userId: args.userId,
      prospectId: application.getProspectId(),
      prospectActivityTypeId: ProspectActivityTypeId.APPLICATION_KYC_APPROVED,
    })
    
    await services.taskService.create(
      {
        taskTypeId: TaskType.PAYMENT_CHECKOUT,
        applicationId: args.task.getApplicationId(),
        applicationChecklistId: args.task.getApplicationChecklistId(),
        optional: new BooleanValue(true),
      },
      [GroupId.BACKOFFICE],
    )

    await services.taskService.create(
      {
        taskTypeId: TaskType.PAYMENT_VALIDATION,
        applicationId: args.task.getApplicationId(),
        applicationChecklistId: args.task.getApplicationChecklistId(),
      },
      [GroupId.BACKOFFICE],
    )


    return true
  },
  decline: async (args, services) => {
    const application = args.task.getApplication()
    if (!application) throw new DispatchValidationError('Application inexistent or inactive')

    await services.prospectService.updateStatus({
      userId: args.userId,
      prospectId: application.getProspectId(),
      prospectStatusId: ProspectStatusId.APPLICATION_REJECTED,
    })

    return true
  },
}
