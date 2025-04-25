import { ValueObject } from '@domain/kernel/ValueObject'
import { ValidationError } from '@domain/error/ValidationError'

export type ExternalVerificationTypeValue = 'identity' | 'document' | 'address' | 'biometric' | 'aml'

export class ExternalVerificationType extends ValueObject<'ExternalVerificationType', string> {
  constructor(value: string) {
    if (!ExternalVerificationType.isValid(value)) {
      throw new ValidationError(
        `Invalid external verification type: ${value}. Valid values are: ${ExternalVerificationType.getValidValues().join(
          ', '
        )}`
      )
    }
    super(value)
  }

  static isValid(value: string): boolean {
    return ExternalVerificationType.getValidValues().includes(value)
  }

  static getValidValues(): string[] {
    return ['identity', 'document', 'address', 'biometric', 'aml']
  }

  static identity(): ExternalVerificationType {
    return new ExternalVerificationType('identity')
  }

  static document(): ExternalVerificationType {
    return new ExternalVerificationType('document')
  }

  static address(): ExternalVerificationType {
    return new ExternalVerificationType('address')
  }

  static biometric(): ExternalVerificationType {
    return new ExternalVerificationType('biometric')
  }

  static aml(): ExternalVerificationType {
    return new ExternalVerificationType('aml')
  }
} 