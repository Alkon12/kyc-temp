import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import AbstractPaymentValidationService from '@domain/paymentValidation/AbstractPaymentValidationService'
import type PaymentValidationRepository from '@domain/paymentValidation/PaymentValidationRepository'
import { PaymentValidationEntity } from '@domain/paymentValidation/PaymentValidationEntity'
import { IPaymentValidation } from '@type/IPaymentValidation'
import { PaymentBillEntity } from '@domain/paymentValidation/PaymentBillEntity'
import { IPaymentCheckout } from '@type/IPaymentCheckout'

@injectable()
export class PaymentValidationService implements AbstractPaymentValidationService {
  constructor(
    @inject(DI.PaymentValidationRepository)
    private readonly paymentValidationRepository: PaymentValidationRepository,
  ) {}

  async validatePayment(data: IPaymentValidation): Promise<PaymentValidationEntity | null> {
    const validation = await this.paymentValidationRepository.validatePayment(data)
    return validation ? new PaymentValidationEntity(validation.idPayment) : null
  }

  async createPaymentBill(data: IPaymentCheckout): Promise<PaymentBillEntity> {
    const paymentBill = await this.paymentValidationRepository.createPaymentBill(data)
    return new PaymentBillEntity(paymentBill.billId.toDTO(), paymentBill.folio.toDTO(), paymentBill.serie.toDTO())
  }
}
