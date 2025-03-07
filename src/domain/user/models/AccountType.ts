import { ValueObject } from '@domain/kernel/ValueObject'
import { ValidationError } from '@domain/error/ValidationError'

const values = {
  OAUTH: 'oauth',
}

export class AccountType extends ValueObject<'AccountType', string> {
  constructor(value: string) {
    const valid = Object.values(values)
    if (!valid.includes(value)) {
      throw new ValidationError(`Invalid AccountType [${value}], must be one of "${valid.join()}"`)
    }
    super(value)
  }

  static OAUTH = new AccountType(values.OAUTH)
}
