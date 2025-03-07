import { ValidationError } from '@domain/error'
import { NumberValueAbstract } from './NumberValueAbstract'

export abstract class PositiveNumberAbstract<Brand> extends NumberValueAbstract<Brand> {
  constructor(value: number) {
    if (value < 0) {
      throw new ValidationError(`Invalid positive number [${value}]`)
    }

    super(value)
  }
}
