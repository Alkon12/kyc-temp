import { IPaymentCheckout } from '@type/IPaymentCheckout'
import { PaymentValidationEntity } from './PaymentValidationEntity'
import { IPaymentValidation } from '@type/IPaymentValidation'
import { PaymentBillEntity } from './PaymentBillEntity'
import { StringValue } from '@domain/shared/StringValue'
import { NumberValue } from '@domain/shared/NumberValue'

export interface IBillEntity {
  billId: NumberValue
  folio: NumberValue
  serie: StringValue
}

export default interface PaymentValidationRepository {
  validatePayment(data: IPaymentValidation): Promise<PaymentValidationEntity | null>
  createPaymentBill(data: IPaymentCheckout): Promise<IBillEntity>
  reconciliatePayments(quoteSmartItId: StringValue): Promise<boolean>
}
