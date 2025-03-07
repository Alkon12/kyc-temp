import { ValidationError } from '@domain/error/ValidationError'
import { ValueObject } from '@domain/kernel/ValueObject'

const values = {
  CDMX: 'CDMX',
  COSTA_ESTE: 'COSTA_ESTE',
  COSTA_OESTE: 'COSTA_OESTE',
  UNKNOWN: 'UNKNOWN',
}

export class Location extends ValueObject<'Location', string> {
  constructor(value: string) {
    const valid = Object.values(values)
    if (!valid.includes(value)) {
      throw new ValidationError(`Invalid Location [${value}], must be one of "${valid.join()}"`)
    }
    super(value)
  }

  static CDMX = new Location(values.CDMX)
  static COSTA_ESTE = new Location(values.COSTA_ESTE)
  static COSTA_OESTE = new Location(values.COSTA_OESTE)
  static UNKNOWN = new Location(values.UNKNOWN)
}
