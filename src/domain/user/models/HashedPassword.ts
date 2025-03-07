import { ValueObject } from '@domain/kernel/ValueObject'

export class HashedPassword extends ValueObject<'HashedPassword', string> {
  constructor(value: string) {
    super(value)
  }
}
