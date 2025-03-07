import { ValidationError } from '@domain/error/ValidationError'
import { ValueObject } from '@domain/kernel/ValueObject'
import { isString } from 'lodash'

export class BranchId extends ValueObject<'BranchId', string> {
  constructor(value: string) {
    if (!BranchId.isValid(value)) {
      throw new ValidationError(`Invalid branch ID [${value}]`)
    }
    super(value)
  }

  static isValid(str: string): boolean {
    return isString(str) && str.length > 0
  }
}
