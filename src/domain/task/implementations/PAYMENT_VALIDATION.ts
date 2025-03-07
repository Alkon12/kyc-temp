import { ChecklistId } from '@domain/checklist/models/ChecklistId'
import { TaskTypeConfig } from '../TaskManager'
import { DispatchValidationError } from '../models/DispatchValidationError'
import { TaskType } from '@domain/task/models/TaskType'
import { GroupId } from '@domain/user/models/GroupId'

export const PAYMENT_VALIDATION: TaskTypeConfig = {
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
    await services.taskService.create(
      {
        taskTypeId: TaskType.DELIVERY_DATE,
        applicationId: args.task.getApplicationId(),
        applicationChecklistId: args.task.getApplicationChecklistId(),
        originTaskId: args.task.getId(),
      },
      [GroupId.BACKOFFICE],
    )

    return true
  },
}
