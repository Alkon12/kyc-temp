import { injectable } from 'inversify'
import fetch from 'node-fetch'
import { PaymentValidationEntity } from '@domain/paymentValidation/PaymentValidationEntity'
import PaymentValidationRepository, { IBillEntity } from '@domain/paymentValidation/PaymentValidationRepository'
import { PaymentValidationFactory } from '@domain/paymentValidation/PaymentValidationFactory'
import { IPaymentValidation } from '@type/IPaymentValidation'
import { IPaymentCheckout } from '@type/IPaymentCheckout'
import { NumberValue } from '@domain/shared/NumberValue'
import { StringValue } from '@domain/shared/StringValue'

@injectable()
export class PaymentValidationApi implements PaymentValidationRepository {
  async validatePayment(data: IPaymentValidation): Promise<PaymentValidationEntity | null> {
    const url = `${process.env.NEXT_PUBLIC_URL_SMARTIT}pagos/uber/validapagoinicial`
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${data.idsmartIt}`,
      },
      body: JSON.stringify({
        IdCotizacion: data.idCotizacion,
      }),
    }

    const response = await fetch(url, options)
    const result = await response.json()
    if (result.Message || result.EsValido == false) {
      let errorMessage = ''
      if (result.Message) {
        errorMessage = result.Message
      } else {
        errorMessage = `Monto Abonado: ${result.MontoAbonado}, Monto Deuda: ${result.MontoDeuda}`
      }
      throw new Error(errorMessage)
    }
    return PaymentValidationFactory.fromDTO(result.EsValido)
  }

  async createPaymentBill(data: IPaymentCheckout): Promise<IBillEntity> {
    if (!data.idcliente || !data.referencia) {
      console.error('[PaymentValidationApi] (createPaymentBill) - Invalid Parameters')
      throw new Error('Invalid parameters')
    }

    const url = `${process.env.NEXT_PUBLIC_URL_SMARTIT}pagos/uber/deposito-ventanilla`
    console.log('>>> FINANCIAL SMARTIT URL', url)

    try{

      const paymentsResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SMARTIT_API_SECRET_KEY}`
        },
        body: JSON.stringify({
          LineaCaptura: data.referencia,
          IdCliente: data.idcliente
        })
      })

      if(paymentsResponse?.status !== 200) throw new Error('error smart it bill creation')

      console.log('[PaymentValidation] (createPaymentBill) - response', paymentsResponse)
      console.log(`HTTP Response Code: ${paymentsResponse?.status}`)

      const paymentBill = await paymentsResponse.json()
      console.log('[PaymentValidation] (createPaymentBill) - responseJson', paymentBill)


      const res: IBillEntity = {
        billId: new NumberValue(paymentBill.IdFactura),
        folio: new NumberValue(paymentBill.Folio),
        serie: new StringValue(paymentBill.Serie),
      }

      return res

    }catch(error){
      console.error('[FinancialService] (createPaymentBill) ',error)
      throw new Error('Bill creation fails')
    }
  }

  async reconciliatePayments(quoteSmartItId: StringValue): Promise<boolean> {
    // const url = `${process.env.NEXT_PUBLIC_URL_SMARTIT}pagos/uber/deposito-ventanilla`
    // console.log('>>> FINANCIAL SMARTIT URL', url)

    console.log('>>> AAAAAAA', quoteSmartItId)

    try {
      // const paymentsResponse = await fetch(url, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${process.env.SMARTIT_API_SECRET_KEY}`
      //   },
      //   body: JSON.stringify({
      //     LineaCaptura: data.referencia,
      //     IdCliente: data.idcliente
      //   })
      // })

      // const paymentBill = await paymentsResponse.json()
      // console.log('[PaymentValidation] (createPaymentBill) - responseJson', paymentBill)

      return true
    } catch (error) {
      console.error('[PaymnentValidationApi] (reconciliatePayments) ', error)
      throw new Error('reconciliatePayments error')
    }
  }
}
