import { IPaymentCheckout } from '@type/IPaymentCheckout';
import { PaymentValidationEntity } from './PaymentValidationEntity';
import { PaymentBillEntity } from './PaymentBillEntity';
import { IPaymentValidation } from '@type/IPaymentValidation';

export default abstract class AbstractPaymentValidationService {
    abstract validatePayment(data: IPaymentValidation): Promise<PaymentValidationEntity | null>;
    abstract createPaymentBill(data: IPaymentCheckout): Promise<PaymentBillEntity>
}
