import { PaymentValidationEntity } from './PaymentValidationEntity';
import { IPaymentValidation } from '@type/IPaymentValidation';

export class PaymentValidationFactory {
    public static fromDTO(idPayment: string): PaymentValidationEntity {
        return new PaymentValidationEntity(idPayment);
    }
}
