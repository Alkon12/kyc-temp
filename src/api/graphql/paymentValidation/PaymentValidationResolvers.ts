import { inject, injectable } from 'inversify'
import AbstractPaymentValidationService from '@domain/paymentValidation/AbstractPaymentValidationService'
import { DI } from '@infrastructure'

@injectable()
export class PaymentValidationResolvers {
  constructor(
    @inject(DI.PaymentValidationService)
    private readonly paymentValidationService: AbstractPaymentValidationService,
  ) {}

  build() {
    return {
      Query: {
        validatePayment: this.validatePayment,
      },
      Mutation: {
        createPaymentBill: this.createPaymentBill,
      },
    }
  }

  private validatePayment = async (
    _parent: unknown,
    {
      idCotizacion,
      idsmartIt,
    }: {
      idCotizacion: number
      idsmartIt: string
    },
  ): Promise<any> => {
    const data = { idCotizacion, idsmartIt }

    const result = await this.paymentValidationService.validatePayment(data)

    if (result) {
      return {
        idPayment: result.idPayment,
      }
    }

    return null
  }

  private createPaymentBill = async (
    _parent: unknown,
    { referencia, idcliente }: { referencia: string; idcliente: number },
  ): Promise<any> => {
    const data = { referencia, idcliente }
    const result = await this.paymentValidationService.createPaymentBill(data)

    if (result) {
      return result
    }
  }
}
