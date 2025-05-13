import { ValidationError } from '@domain/error/ValidationError'
import { ValueObject } from '@domain/kernel/ValueObject'

export class JsonValue extends ValueObject<'JsonValue', Record<string, any>> {
  constructor(value: Record<string, any> | string) {
    if (!JsonValue.isValid(value)) {
      throw new ValidationError(`Invalid Json value [${value}], its not object or string`)
    }

    // Convert string to object if needed
    const parsedValue = typeof value === 'string' ? JSON.parse(value) : value
    super(parsedValue)
  }

  static isValid(value: string | object): boolean {
    if (typeof value === 'string') {
      try {
        JSON.parse(value)
        return true
      } catch {
        return false
      }
    }
    return typeof value === 'object'
  }

  getJson(): Record<string, any> {
    return this._value
  }

  static fromString(jsonString: string): JsonValue {
    try {
      return new JsonValue(jsonString)
    } catch (error) {
      throw new Error(`Invalid JSON string: ${error}`)
    }
  }

  toString(): string {
    return JSON.stringify(this._value)
  }
}
