import { StringValueAbstract } from '@domain/shared/base/StringValueAbstract'
import { ValidationError } from '@domain/error/ValidationError'

export type KycVerificationStatusType = 'pending' | 'in-progress' | 'approved' | 'rejected' | 'requires-review'

export class KycVerificationStatus extends StringValueAbstract<'KycVerificationStatus'> {
  private static readonly VALID_STATUSES: KycVerificationStatusType[] = [
    'pending',
    'in-progress',
    'approved',
    'rejected',
    'requires-review'
  ]

  constructor(value: string) {
    if (!KycVerificationStatus.isValid(value)) {
      throw new ValidationError(
        `Invalid status value [${value}], must be one of: ${KycVerificationStatus.VALID_STATUSES.join(', ')}`
      )
    }
    super(value)
  }

  static isValid(value: string): boolean {
    return KycVerificationStatus.VALID_STATUSES.includes(value as KycVerificationStatusType)
  }
}
