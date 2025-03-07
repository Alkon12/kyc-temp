import { ValueObject } from '@domain/kernel/ValueObject'
import { ValidationError } from '@domain/error/ValidationError'

const VALUES = {
  IDENTIFICATION_CARD: 'IDENTIFICATION-CARD',
  IDENTIFICATION_CARD_REVERSE: 'IDENTIFICATION-CARD-REVERSE',
  SELFIE_PICTURE: 'SELFIE-PICTURE',
  DRIVERS_LICENSE: 'DRIVERS-LICENSE',
  DRIVERS_LICENSE_REVERSE: 'DRIVERS-LICENSE-REVERSE',
  INCOME_STATEMENT: 'INCOME-STATEMENT',
  INACTIVITY_STATEMENT: 'INACTIVITY-STATEMENT',
  TAX_IDENTIFICATION: 'TAX-IDENTIFICATION',
  ADDRESS_PROOF: 'ADDRESS-PROOF',
}

export class ContentNature extends ValueObject<'ContentNature', string> {
  constructor(value: string) {
    const valid = Object.values(VALUES)
    if (!valid.includes(value)) {
      throw new ValidationError(`Invalid Content Nature [${value}], must be one of "${valid.join()}"`)
    }
    super(value)
  }

  static get(value: ContentNature | string): ContentNature {
    return typeof value === 'string' ? new ContentNature(value) : value
  }

  static IDENTIFICATION_CARD = new ContentNature(VALUES.IDENTIFICATION_CARD)
  static IDENTIFICATION_CARD_REVERSE = new ContentNature(VALUES.IDENTIFICATION_CARD_REVERSE)
  static SELFIE_PICTURE = new ContentNature(VALUES.SELFIE_PICTURE)
  static DRIVERS_LICENSE = new ContentNature(VALUES.DRIVERS_LICENSE)
  static DRIVERS_LICENSE_REVERSE = new ContentNature(VALUES.DRIVERS_LICENSE_REVERSE)
  static INCOME_STATEMENT = new ContentNature(VALUES.INCOME_STATEMENT)
  static INACTIVITY_STATEMENT = new ContentNature(VALUES.INACTIVITY_STATEMENT)
  static TAX_IDENTIFICATION = new ContentNature(VALUES.TAX_IDENTIFICATION)
  static ADDRESS_PROOF = new ContentNature(VALUES.ADDRESS_PROOF)
}
