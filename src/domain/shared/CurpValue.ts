import { ValidationError } from '@domain/error/ValidationError'
import { ValueObject } from '@domain/kernel/ValueObject'

export class CurpValue extends ValueObject<'CurpValue', string> {
  constructor(value: string) {
    if (!CurpValue.isValid(value)) {
      throw new ValidationError(`Invalid CURP [${value}]`)
    }
    super(value)
  }

  static isValid(curp: string): boolean {
    const curpRegex =
      /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/
    return curpRegex.test(curp)
  }

  getGender(): string {
    return this._value[10]
  }

  getDateOfBirth(): string {
    const sDay = this._value.substring(8, 10)
    const sMonth = this._value.substring(6, 8)
    const sYear = this._value.substring(4, 6)
    const year = isNaN(Number(this._value.substring(16, 17))) ? '20' + sYear : '19' + sYear
    return `${year}-${sMonth}-${sDay}`
  }
}
