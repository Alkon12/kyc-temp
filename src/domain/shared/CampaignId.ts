import { ValidationError } from '@domain/error/ValidationError'
import { ValueObject } from '@domain/kernel/ValueObject'
import { isString } from 'lodash'

export class CampaignId extends ValueObject<'CampaignId', string> {
  constructor(value: string) {
    if (!CampaignId.isValid(value)) {
      throw new ValidationError(`Invalid campaign ID [${value}]`)
    }
    super(value)
  }

  static isValid(str: string): boolean {
    return isString(str) && str.length > 0
  }
}
