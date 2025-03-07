import {
  FinancialService,
  FinancialWeeklySummary,
  LeasingFinancialDebtVoucher,
  PendingPayment,
  WeekDetail,
  BankReferDetails,
  PaymentBill,
  ContractAccountSummary,
  PendingBankReference
} from '@/application/service/FinancialService'
import { NotFoundError, UnexpectedError } from '@domain/error'
import AbstractLeasingService from '@domain/leasing/LeasingService'
import { DateTimeValue } from '@domain/shared/DateTime'
import { NumberValue } from '@domain/shared/NumberValue'
import { StringValue } from '@domain/shared/StringValue'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { UUID } from '@domain/shared/UUID'
import { DI } from '@infrastructure/inversify.symbols'
import { inject, injectable } from 'inversify'

interface PendingPaymentResponse {
  ReferenciaBancaria: string
  Estatus: string
  Total: number
  Semana: {
    IdAgencia: number
    Id: number
    IdContrato: number
    NumeroSemana: number
    FechaInicio: string
    FechaTermino: string
    FechaCorte: string
    FechaVencimiento: string
    Cerrada: boolean
    Conciliada: boolean
  }
  IdPersona: number
  Nombre: string
  IdContrato: number
  RFC: string
  Fecha: string
  Folio: string
  Id: number
  IdAgencia: number
  Hora: string
  Detalle: {
    Id: number
    IdConcepto: number
    Descripcion: string
    Cantidad: number
    PrecioUnitario: number
    Importe: number
    Total: number
  }[]
}[]

@injectable()
export class FinancialSmartIt implements FinancialService {
  @inject(DI.LeasingService) private _leasingService!: AbstractLeasingService

  async weeklySummary(leasingId: UUID): Promise<FinancialWeeklySummary[]> {
    const leasing = await this._leasingService.getById(leasingId)

    const contractId = leasing.getVehicle()?.getContractId()
    if (!contractId) {
      console.error('Contract not found')
      throw new NotFoundError('Device not found')
    }

    const url = `${process.env.NEXT_PUBLIC_URL_SMARTIT}cuentacorriente/${contractId.toDTO()}`
    console.log('>>> FINANCIAL SMARTIT URL', url)

    interface FinancialResponse {
      ContratoId: number
      Semanas: {
        Id: number
        FechaInicio: string
        FechaTermino: string
        FechaCorte: string
        Semanalidad: number
        PenalidadUso: number
        SaldoPendiente: number
        Intereses: number
        Multas: number
      }[]
    }

    try {
      const financialResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SMARTIT_API_SECRET_KEY}`
        },
      })

      const responseJson = (await financialResponse.json()) as FinancialResponse

      console.log('Financial weekly responseJson', responseJson)

      const weeks = responseJson.Semanas
      if (!weeks) {
        throw new UnexpectedError(`Financial SmartIT, expected Weeks node not found in response`)
      }

      return weeks.map((week) => {
        const totalAmount = week.Semanalidad + week.PenalidadUso + week.Multas + week.Intereses

        return {
          weekNumber: new NumberValue(week.Id),
          startDate: new DateTimeValue(week.FechaInicio),
          endDate: new DateTimeValue(week.FechaTermino),
          cutDate: new DateTimeValue(week.FechaCorte),
          weeklyFeeAmount: new NumberValue(week.Semanalidad),
          behaviorFineAmount: new NumberValue(week.PenalidadUso),
          otherFinesAmount: new NumberValue(week.Multas),
          previousUnpaidAmount: new NumberValue(week.SaldoPendiente),
          interestsAmount: new NumberValue(week.Intereses),
          totalAmount: new NumberValue(totalAmount),
        }
      })
    } catch (error) {
      console.error(error)
      throw new UnexpectedError(`Financial SmartIT, error`)
    }
  }

  async weekSummary(leasingId: UUID, weekNumber: NumberValue): Promise<FinancialWeeklySummary> {
    const weeks = await this.weeklySummary(leasingId)

    return weeks[weekNumber.toDTO()]
  }

  async getDebtVoucher(leasingId: UUID, weekNumber: NumberValue): Promise<LeasingFinancialDebtVoucher | null> {
    const leasing = await this._leasingService.getById(leasingId)

    const contractId = leasing.getVehicle()?.getContractId()
    if (!contractId) {
      console.error('Contract not found')
      throw new NotFoundError('Device not found')
    }

    const url = `${process.env.NEXT_PUBLIC_URL_SMARTIT}cuentacorriente/${contractId.toDTO()}/semana/0/saldopendiente/referencia`
    console.log('>>> FINANCIAL SMARTIT URL', url)

    interface VoucherResponse {
      referencia: string
      importe: number
      fechaLimite: string
    }

    try {
      const voucherResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SMARTIT_API_SECRET_KEY}`
        },
      })
      const respuesta = await voucherResponse.json();
      const voucher = (await voucherResponse.json()) as VoucherResponse

      console.log('Financial weekly voucher', voucher)

      if (!voucher) {
        return null
      }

      return {
        code: new StringValue(voucher.referencia),
        amount: new NumberValue(voucher.importe),
        validUntil: new DateTimeValue(voucher.fechaLimite),
      }
    } catch (error) {
      console.error(error)
      throw new UnexpectedError(`Financial SmartIT, error`)
    }
  }

  async getPendingPayments(contractId: NumberValue): Promise<PendingPayment[] | null> {
    if (!contractId) {
      console.error('Contract not found')
      throw new NotFoundError('Device not found')
    }

    const url = `${process.env.NEXT_PUBLIC_URL_SMARTIT}cotizaciones/${contractId.toDTO()}/notas-pendientes`
    console.log('>>> FINANCIAL SMARTIT URL', url)

    

    try {
      const paymentsResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SMARTIT_API_SECRET_KEY}`
        },
      })

      const responseJson = (await paymentsResponse.json()) as PendingPaymentResponse[]

      console.log('Financial pending payments responseJson', responseJson)

      const payments = responseJson
      // if (payments.length == 0) {
      //   throw new UnexpectedError(`Financial SmartIT, expected PendingPayment node not found in response`)
      // }

      return payments.map((payment) => {
        return {
          id: new NumberValue(payment.Id),
          bankReferer: new StringValue(payment.ReferenciaBancaria),
          week: new NumberValue(payment.Semana.NumeroSemana), 
          cycleEndDate: new DateTimeValue(payment.Semana.FechaCorte),
          total: new NumberValue(payment.Total),
          date: new DateTimeValue(payment.Fecha),
          details: payment.Detalle.map((detail) => {
            return {
              code: new NumberValue(detail.IdConcepto),
              description: new StringValue(detail.Descripcion),
              amount: new NumberValue(detail.Cantidad),
              price: new NumberValue(detail.Total),
            }
          })
        }
      })
    } catch (error) {
      console.error(error)
      throw new UnexpectedError(`Financial SmartIT, pending payments error`)
    }
  }

  async getPendingPaymentsByReference(contractId: NumberValue, reference: StringValue): Promise<PendingPayment[] | null> {

    const url = `${process.env.NEXT_PUBLIC_URL_SMARTIT}cotizaciones/${contractId.toDTO()}/notas-pendientes?aReferencia=${reference.toDTO()}`
    console.log('>>> FINANCIAL SMARTIT URL', url)

    try {
      const paymentsResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SMARTIT_API_SECRET_KEY}`
        },
      })

      const responseJson = (await paymentsResponse.json()) as PendingPaymentResponse[]

      console.log('Financial pending payments responseJson', responseJson)

      const payments = responseJson

      return payments.map((payment) => {
        return {
          id: new NumberValue(payment.Id),
          bankReferer: new StringValue(payment.ReferenciaBancaria),
          week: new NumberValue(payment.Semana.NumeroSemana),
          cycleEndDate: new DateTimeValue(payment.Semana.FechaCorte),
          total: new NumberValue(payment.Total),
          date: new DateTimeValue(payment.Fecha),
          details: payment.Detalle.map((detail) => {
            return {
              code: new NumberValue(detail.IdConcepto),
              description: new StringValue(detail.Descripcion),
              amount: new NumberValue(detail.Cantidad),
              price: new NumberValue(detail.Total),
            }
          })
        }
      })
    } catch (error) {
      console.error(error)
      throw new UnexpectedError(`Financial SmartIT, pending payments error`)
    }
  }

  async getBanksWithReferDeatils(): Promise<BankReferDetails[]> {

    const url = `${process.env.NEXT_PUBLIC_URL_SMARTIT}bancos-datos-referencia`
    console.log('>>> FINANCIAL SMARTIT URL', url)

    interface BanksWithDetailsResponse {
      IdAgencia: number
      IdBanco: number
      Nombre: string
      Convenio: number
      CLABE: string
      NumeroDeCuenta: string
      PaBanco: string
    }[]

    try {
      const paymentsResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SMARTIT_API_SECRET_KEY}`
        },
      })

      const responseJson = (await paymentsResponse.json()) as BanksWithDetailsResponse[]

      console.log('Financial pending payments responseJson', responseJson)

      const payments = responseJson
      if (payments.length == 0) {
        throw new UnexpectedError(`Financial SmartIT, expected PendingPayment node not found in response`)
      }

      return payments.map((payment) => {
        return {
          ciaId: new NumberValue(payment.IdAgencia),
          bankId: new NumberValue(payment.IdBanco),
          bank: new StringValue(payment.Nombre),
          agreement: new NumberValue(payment.Convenio),
          clabe: new StringValue(payment.CLABE),
          account: new StringValue(payment.NumeroDeCuenta),
        }
      })
    } catch (error) {
      console.error(error)
      throw new UnexpectedError(`Financial SmartIT, pending payments error`)
    }
  }

  async createPaymentBill(bankReferer: StringValue, personId: NumberValue): Promise<PaymentBill> {
    if (!bankReferer || !personId) {
      console.error('[FinancialService] (createPaymentBill) - Invalid Parameters')
      throw new UnexpectedError('Invalid parameters')
    }

    const url = `${process.env.NEXT_PUBLIC_URL_SMARTIT}pagos/uber/deposito-ventanilla`
    console.log('>>> FINANCIAL SMARTIT URL', url)

    try {

      const paymentsResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SMARTIT_API_SECRET_KEY}`
        },
        body: JSON.stringify({
          LineaCaptura: bankReferer,
          IdCliente: personId
        })
      })

      const paymentBill = await paymentsResponse.json()
      console.log('[FinancialService] (createPaymentBill) - responseJson', paymentBill)

      return {
        billId: paymentBill.IdFactura,
        folio: paymentBill.Folio,
        serie: paymentBill.Serie
      }

    } catch (error) {
      console.error('[FinancialService] (createPaymentBill) ', error)
      throw new UnexpectedError('Bill creation fails')
    }


  }

  async getContractAccountSummary(quoteSmartItId: NumberValue): Promise<ContractAccountSummary | null> {
    try{

      if (!quoteSmartItId) {
        console.error('[FinancialService] (getContractAccountSummary) - Invalid Parameters')
        throw new UnexpectedError('Invalid parameters')
      }

      const url = `${process.env.NEXT_PUBLIC_URL_SMARTIT}cuentacorriente/contratos/${quoteSmartItId.toDTO()}/resumen-cuenta`
      console.log('>>> FINANCIAL SMARTIT URL', url)

      const contractAccountSummaryResponse = await fetch(url, {
        method: 'GET',
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SMARTIT_API_SECRET_KEY}`
        }
      })

      const contractAccountSummary = await contractAccountSummaryResponse.json()

      return {
        companyId: new NumberValue(contractAccountSummary.IdAgencia),
        contractId: new NumberValue(contractAccountSummary.IdContrato),
        weekNumber: new NumberValue(contractAccountSummary.NumeroSemana),
        startDate: new DateTimeValue(contractAccountSummary.FechaInicio),
        endDate: new DateTimeValue(contractAccountSummary.FechaTermino),
        cycleEndDate: new DateTimeValue(contractAccountSummary.FechaCorte),
        grandTotal: new NumberValue(contractAccountSummary.Total),
        accounts: contractAccountSummary.Cuentas.map( (c: any) => { return {
          accountTypeId: new NumberValue(c.IdTipoMovimiento),
          accountName: new StringValue(c.Cuenta),
          amount: new NumberValue(c.Importe),
          subAccounts: c.SubCuentas && c.SubCuentas.length > 0 ? c.SubCuentas.map( (sc: any) => { return {
            accountTypeId: new NumberValue(sc.IdTipoMovimiento),
            accountName: new StringValue(sc.Cuenta),
            amount: new NumberValue(sc.Importe),
            subAccounts: undefined
          }}) : []
        }})
      }

    } catch (error) {
      console.log('[FinancialService] (getContractAccountSummary) ', error)
      throw new UnexpectedError('Unable to obtain the Contract Account Summary')
    }
  }

  async getPendingBankReferences(quoteSmartItId: NumberValue) : Promise<PendingBankReference[]> {

    if (!quoteSmartItId) {
      console.error('[FinancialService] (getContractAccountSummary) - Invalid Parameters')
      throw new UnexpectedError('Invalid parameters')
    }

    interface BankReferenceResponse {
      Referencia: string
      Importe: number
      FechaLimite: string
    }

    ///api/UberArrendo/contratos/{{aIdCotizacion}}/referencias
    const url = `${process.env.NEXT_PUBLIC_URL_SMARTIT}contratos/${quoteSmartItId.toDTO()}/referencias`
    console.log('>>> FINANCIAL SMARTIT URL', url)

    const pendingBankReferencesResponse = await fetch(url, {
      method: 'GET',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SMARTIT_API_SECRET_KEY}`
      }
    })

    const pendingBankReferences = await pendingBankReferencesResponse.json() as BankReferenceResponse[]

    return pendingBankReferences.map((r) => { return {
      reference: new StringValue(r.Referencia),
      amount: new NumberValue(r.Importe),
      endDate: r.FechaLimite ? new DateTimeValue(r.FechaLimite) : null,
      pendingPayments: []
    }})
  }

  async createBankReference(quoteSmartItId: NumberValue, pendingPaymentsIds: NumberValue[]): Promise<PendingBankReference> {
    // if (!bankReferer || !personId) {
    //   console.error('[FinancialService] (createPaymentBill) - Invalid Parameters')
    //   throw new UnexpectedError('Invalid parameters')
    // }

    const url = `${process.env.NEXT_PUBLIC_URL_SMARTIT}contratos/${quoteSmartItId.toDTO()}/referencias`
    console.log('>>> FINANCIAL SMARTIT URL', url)

    try {

      const paymentsResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SMARTIT_API_SECRET_KEY}`
        },
        body: JSON.stringify(pendingPaymentsIds.map(p => p.toDTO()))
      })

      const paymentBill = await paymentsResponse.json()
      console.log('[FinancialService] (createPaymentBill) - responseJson', paymentBill)

      return {
        reference: new StringValue(paymentBill.Referencia),
        amount: new NumberValue(paymentBill.Importe),
        endDate: paymentBill.FechaLimite ? new DateTimeValue(paymentBill.FechaLimite) : null,
        pendingPayments: paymentBill.Notas ? paymentBill.Notas.map((n: any) => {
          return {
            id: new NumberValue(n.Id),
            bankReferer: new StringValue(n.ReferenciaBancaria),
            week: new NumberValue(n.Semana.NumeroSemana),
            cycleEndDate: new DateTimeValue(n.Semana.FechaCorte),
            total: new NumberValue(n.Total),
            details: n.Detalle.map((d: any) => {
              return {
                code: new NumberValue(d.IdConcepto),
                description: new StringValue(d.Descripcion),
                amount: new NumberValue(d.Cantidad),
                price: new NumberValue(d.Total),
              }
            })
          }
        }) : []
      }

    } catch (error) {
      console.error('[FinancialService] (createPaymentBill) ', error)
      throw new UnexpectedError('Bank Reference creation fails')
    }


  }

}
