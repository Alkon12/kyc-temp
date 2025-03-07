import { TaskTypeConfig } from '../TaskManager'
import { DispatchValidationError } from '../models/DispatchValidationError'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import PaymentValidationRepository from '@domain/paymentValidation/PaymentValidationRepository'
import { StringValue } from '@domain/shared/StringValue'

export const PAYMENT_RECONCILIATION: TaskTypeConfig = {
  validation: (args, services) => {
    const application = args.task.getApplication()
    if (!application) return new DispatchValidationError('Application inexistent or inactive')
    if (!application.getQuote()?.getScoringComplete())
      return new DispatchValidationError('Quote with scoring incomplete')

    return null
  },
  accept: async (args, services) => {
    console.log('PAYMENT_RECONCILIATION')
    const application = args.task.getApplication()
    if (!application) throw new DispatchValidationError('Application inexistent or inactive')

    console.log('PAYMENT_RECONCILIATION 222222')

    const paymentValidationRepository = container.get<PaymentValidationRepository>(DI.PaymentValidationRepository)

    await paymentValidationRepository.reconciliatePayments(new StringValue('2232'))

    // await services.taskService.create(
    //   {
    //     taskTypeId: TaskType.DELIVERY_DATE,
    //     applicationId: args.task.getApplicationId(),
    //     applicationChecklistId: args.task.getApplicationChecklistId(),
    //     originTaskId: args.task.getId(),
    //   },
    //   [GroupId.BACKOFFICE],
    // )

    return true
  },
}
