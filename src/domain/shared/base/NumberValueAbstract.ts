import { ValueObject } from '@domain/kernel/ValueObject'
import { ValidationError } from '@domain/error'
import { NumberValue } from '../NumberValue'

export abstract class NumberValueAbstract<Brand> extends ValueObject<Brand, number> {
  constructor(value: number) {
    const _value = Number.isNaN(value) ? 0 : Number(value)

    if (!Number.isFinite(_value) || typeof value === 'bigint') {
      throw new ValidationError(`Invalid NumberValue [${value}]`)
    }
    super(_value)
  }

  toRound(precision = 1) {
    return NumberValue.round(this._value, precision)
  }

  isLessThanOrEqual(value: this | number) {
    const number = ValueObject.isValueObject(value) ? value.toDTO() : value
    return this._value <= number
  }

  static round(num: number, precision = 1) {
    return parseFloat(num.toFixed(precision))
  }
}
