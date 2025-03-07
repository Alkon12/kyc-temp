import { ValidationError } from '@domain/error/ValidationError'
import { ValueObject } from '@domain/kernel/ValueObject'
import { ContentProvider } from './ContentProvider'
import { StringValue } from '@domain/shared/StringValue'
import { ContentStorageKey } from './ContentStorageKey'

const SPLITTER = '+'

export class ContentKey extends ValueObject<'ContentKey', string> {
  constructor(value: string) {
    if (!ContentKey.isValid(value)) {
      throw new ValidationError(`Invalid Content Key [${value}]`)
    }
    super(value)
  }

  getProvider(): ContentProvider {
    const parts = this._value.split(SPLITTER)
    if (parts.length < 2) {
      throw new ValidationError(`Invalid Content Key [${this._value}] when trying to get Provider`)
    }
    return new ContentProvider(parts[0])
  }

  getKey(): StringValue {
    const parts = this._value.split(SPLITTER)
    if (parts.length < 2) {
      throw new ValidationError(`Invalid Content Key [${this._value}] when trying to get Key`)
    }
    return new StringValue(parts[1])
  }

  static isValid(value?: string): boolean {
    return !!value && value.indexOf(SPLITTER) >= 0
  }

  static build(contentProvider: ContentProvider, key: ContentStorageKey): ContentKey {
    return new ContentKey(`${contentProvider.toDTO()}${SPLITTER}${key.toDTO()}`)
  }
}
