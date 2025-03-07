import { ChecklistId } from '@domain/checklist/models/ChecklistId'
import { TaskTypeConfig } from '../TaskManager'
import { DispatchValidationError } from '../models/DispatchValidationError'
import { TaskType } from '@domain/task/models/TaskType'
import { GroupId } from '@domain/user/models/GroupId'
import { BooleanValue } from '@domain/shared/BooleanValue'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import PaymentValidationRepository from '@domain/paymentValidation/PaymentValidationRepository'
import { JsonValue } from '@domain/shared/JsonValue'

export const PAYMENT_CHECKOUT: TaskTypeConfig = {
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

    if(!args.metadata || !args.metadata.referencia || !args.metadata.idcliente){
      console.log("[PAYMENT_CHECKOUT] undefined {args.metadata}")
      throw new Error("Invalid parameters")
    }

    const paymentValidationRepository = container.get<PaymentValidationRepository>(DI.PaymentValidationRepository)

    const billResponse = await paymentValidationRepository.createPaymentBill({
      referencia: args.metadata.referencia.toDTO(),
      idcliente: args.metadata.idcliente.toDTO(),
    })

    console.log("[PAYMENT_CHECKOUT] {billResponse}", billResponse)

    const task = args.task

    task.setMetadata(
      new JsonValue({
        billId: billResponse.billId.toDTO(),
        folio: billResponse.folio.toDTO(),
        serie: billResponse.serie.toDTO(),
      }),
    )
    console.log('33333', task.getMetadata())
    await services.taskService.update(task.toDTO())

    return true
  },
}
