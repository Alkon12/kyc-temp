import { ValueObject } from '@domain/kernel/ValueObject'
import { ValidationError } from '@domain/error/ValidationError'

export type ExternalVerificationStatusType = 'pending' | 'completed' | 'failed'

export class ExternalVerificationStatus extends ValueObject<'ExternalVerificationStatus', string> {
  constructor(value: string) {
    if (!ExternalVerificationStatus.isValid(value)) {
      throw new ValidationError(
        `Invalid external verification status: ${value}. Valid values are: ${ExternalVerificationStatus.getValidValues().join(
          ', '
        )}`
      )
    }
    super(value)
  }

  static isValid(value: string): boolean {
    return ExternalVerificationStatus.getValidValues().includes(value)
  }

  static getValidValues(): string[] {
    return ['pending', 'completed', 'failed']
  }

  static pending(): ExternalVerificationStatus {
    return new ExternalVerificationStatus('pending')
  }

  static completed(): ExternalVerificationStatus {
    return new ExternalVerificationStatus('completed')
  }

  static failed(): ExternalVerificationStatus {
    return new ExternalVerificationStatus('failed')
  }
} 