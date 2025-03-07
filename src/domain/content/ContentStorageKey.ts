import { ValueObject } from '@domain/kernel/ValueObject'

export class ContentStorageKey extends ValueObject<'ContentStorageKey', string> {
  constructor(value: string) {
    super(value)
  }
}
