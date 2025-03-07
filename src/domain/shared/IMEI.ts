import { ValidationError } from '@domain/error/ValidationError'
import { ValueObject } from '@domain/kernel/ValueObject'

export class IMEI extends ValueObject<'IMEI', string> {
  constructor(value: string) {
    if (!IMEI.isValid(value)) {
      throw new ValidationError(`Invalid IMEI [${value}]`)
    }
    super(value)
  }

  static isValid(value: string): boolean {
    return value.length > 0
  }
}
