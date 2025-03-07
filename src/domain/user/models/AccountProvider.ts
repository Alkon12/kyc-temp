import { ValueObject } from '@domain/kernel/ValueObject'
import { ValidationError } from '@domain/error/ValidationError'

const values = {
  UBER: 'uber',
}

export class AccountProvider extends ValueObject<'AccountProvider', string> {
  constructor(value: string) {
    const valid = Object.values(values)
    if (!valid.includes(value)) {
      throw new ValidationError(`Invalid AccountProvider [${value}], must be one of "${valid.join()}"`)
    }
    super(value)
  }

  static UBER = new AccountProvider(values.UBER)
}
