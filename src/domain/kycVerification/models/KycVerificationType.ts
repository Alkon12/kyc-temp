import { StringValueAbstract } from '@domain/shared/base/StringValueAbstract'
import { ValidationError } from '@domain/error/ValidationError'

export type KycVerificationTypeValue = 'identity' | 'address' | 'face' | 'document' | 'aml' | 'complete'

export class KycVerificationType extends StringValueAbstract<'KycVerificationType'> {
  private static readonly VALID_TYPES: KycVerificationTypeValue[] = [
    'identity',
    'address',
    'face',
    'document',
    'aml',
    'complete'
  ]

  constructor(value: string) {
    if (!KycVerificationType.isValid(value)) {
      throw new ValidationError(
        `Invalid verification type value [${value}], must be one of: ${KycVerificationType.VALID_TYPES.join(', ')}`
      )
    }
    super(value)
  }

  static isValid(value: string): boolean {
    return KycVerificationType.VALID_TYPES.includes(value as KycVerificationTypeValue)
  }
}
