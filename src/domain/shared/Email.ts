import { ValidationError } from '@domain/error/ValidationError'
import { ValueObject } from '@domain/kernel/ValueObject'

export class Email extends ValueObject<'Email', string> {
  constructor(value: string) {
    if (!Email.isValid(value)) {
      throw new ValidationError(`Invalid email [${value}] address`)
    }
    super(value)
  }

  static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
