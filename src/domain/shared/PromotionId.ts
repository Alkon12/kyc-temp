import { ValidationError } from '@domain/error/ValidationError'
import { ValueObject } from '@domain/kernel/ValueObject'
import { isString } from 'lodash'

export class PromotionId extends ValueObject<'PromotionId', string> {
  constructor(value: string) {
    if (!PromotionId.isValid(value)) {
      throw new ValidationError(`Invalid promotion ID [${value}]`)
    }
    super(value)
  }

  static isValid(str: string): boolean {
    return isString(str) && str.length > 0
  }
}
