import { BooleanValue } from '@domain/shared/BooleanValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { NumberValue } from '@domain/shared/NumberValue'
import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'

export interface FinancialService {
  weeklySummary(leasingId: UUID): Promise<FinancialWeeklySummary[]>
  weekSummary(leasingId: UUID, weekNumber: NumberValue): Promise<FinancialWeeklySummary>
  getDebtVoucher(leasingId: UUID, weekNumber: NumberValue): Promise<LeasingFinancialDebtVoucher | null>
  getPendingPayments(contractId: NumberValue): Promise<PendingPayment[] | null>
  getPendingPaymentsByReference(quoteSmartItId: NumberValue,reference: StringValue): Promise<PendingPayment[] | null>
  getBanksWithReferDeatils() : Promise<BankReferDetails[]>
  getPendingBankReferences(quoteSmartItId: NumberValue) : Promise<PendingBankReference[]>
  getContractAccountSummary(quoteSmartItId: NumberValue): Promise<ContractAccountSummary | null>
  createPaymentBill(bankReferer: StringValue, personId: NumberValue) : Promise<PaymentBill>
  createBankReference(quoteSmartItId: NumberValue, pendingPaymentsIds: NumberValue[]): Promise<PendingBankReference>
}

export interface PendingBankReference {
  reference: StringValue
  amount: NumberValue
  endDate: DateTimeValue | null
  pendingPayments: PendingPayment[]
}

export interface FinancialWeeklySummary {
  weekNumber: NumberValue
  startDate: DateTimeValue
  endDate: DateTimeValue
  cutDate: DateTimeValue
  weeklyFeeAmount: NumberValue
  behaviorFineAmount: NumberValue
  otherFinesAmount: NumberValue
  previousUnpaidAmount: NumberValue
  interestsAmount: NumberValue
  totalAmount: NumberValue
}

export interface LeasingFinancialDebtVoucher {
  code: StringValue
  amount: NumberValue
  validUntil: DateTimeValue
}

export interface WeekDetail{
  id: NumberValue,
  weekNumber: NumberValue,
  startDate: DateTimeValue,
  endDate: DateTimeValue,
  cycleEndDate: DateTimeValue,
  dueDate: DateTimeValue,
  isClosed: BooleanValue,
  isReconciliated: BooleanValue
}

export interface PendingPayment {
  id: NumberValue
  bankReferer: StringValue
  total: NumberValue
  week: NumberValue
  cycleEndDate: DateTimeValue
  date: DateTimeValue
  details: PendingPaymentDetail[]
}

export interface PendingPaymentDetail {
  code: NumberValue
  description: StringValue
  amount: NumberValue
  price: NumberValue
}

export interface BankReferDetails{
  ciaId: NumberValue//  "IdAgencia": 663,
  bankId: NumberValue //  "IdBanco": 1,
  bank: StringValue //  "Nombre": "SANTANDER",
  agreement: NumberValue //  "Convenio": "6195",
  clabe: StringValue //  "CLABE": "014 180 655 043 314 276",
  account: StringValue //  "NumeroDeCuenta": "",
  //  "PaBanco": ""
}

export interface PaymentBill{
  billId: NumberValue
  folio: NumberValue
  serie: StringValue
}

export interface ContractAccountSummary {
  companyId: NumberValue
  contractId: NumberValue
  weekNumber: NumberValue
  startDate: DateTimeValue
  endDate: DateTimeValue
  cycleEndDate: DateTimeValue
  grandTotal: NumberValue
  accounts: AccountSummary[]
}

export interface AccountSummary {
  accountTypeId: NumberValue
  accountName: StringValue
  amount: NumberValue
  subAccounts?: AccountSummary[]
}
