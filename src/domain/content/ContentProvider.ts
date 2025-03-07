import { ValueObject } from '@domain/kernel/ValueObject'
import { ValidationError } from '@domain/error/ValidationError'

export const CONTENT_PROVIDERS = {
  PAPERLESS_TEST: 'PAPERLESS_TEST',
  PAPERLESS_PRODUCTION: 'PAPERLESS_PRODUCTION',
}

export class ContentProvider extends ValueObject<'ContentProvider', string> {
  constructor(value: string) {
    const valid = Object.values(CONTENT_PROVIDERS)
    if (!valid.includes(value)) {
      throw new ValidationError(`Invalid Content Provider [${value}], must be one of "${valid.join()}"`)
    }
    super(value)
  }

  static get(value: ContentProvider | string): ContentProvider {
    return typeof value === 'string' ? new ContentProvider(value) : value
  }

  static PAPERLESS_TEST = new ContentProvider(CONTENT_PROVIDERS.PAPERLESS_TEST)
  static PAPERLESS_PRODUCTION = new ContentProvider(CONTENT_PROVIDERS.PAPERLESS_PRODUCTION)
}
