import { ValidationError } from '@domain/error/ValidationError'
import { ValueObject } from '@domain/kernel/ValueObject'

export class VehicleVin extends ValueObject<'VehicleVin', string> {
  constructor(value: string) {
    if (!VehicleVin.isValid(value)) {
      throw new ValidationError(`Invalid vehicle identification number [${value}]`)
    }
    super(value)
  }

  static isValid(value: string): boolean {
    const valueRegex = /^(?=.*[0-9])(?=.*[A-z])[0-9A-z-]{17}$/ // https://regexr.com/3ars8
    return valueRegex.test(value)
  }
}
