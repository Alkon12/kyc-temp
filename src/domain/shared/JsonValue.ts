import { ValidationError } from '@domain/error/ValidationError'
import { ValueObject } from '@domain/kernel/ValueObject'

export class JsonValue extends ValueObject<'JsonValue', string> {
  constructor(value: string | object) {
    if (!JsonValue.isValid(value)) {
      throw new ValidationError(`Invalid Json value [${value}], its not object or string`)
    }

    const valueAsString = JsonValue.parseToString(value)

    super(valueAsString)
  }

  static isValid(value: string | object): boolean {
    return typeof value === 'object' || typeof value === 'string'
  }

  static parseToString(value: string | object): string {
    return typeof value === 'object' ? JSON.stringify(value) : value
  }

  getJson() {
    return JSON.parse(this._value)
  }
}
