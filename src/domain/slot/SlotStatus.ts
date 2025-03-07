import { ValidationError } from '@domain/error/ValidationError'
import { ValueObject } from '@domain/kernel/ValueObject'

const values = {
  AVAILABLE: 'AVAILABLE',
  UNAVAILABLE: 'UNAVAILABLE',
}

export class SlotStatus extends ValueObject<'SlotStatus', string> {
  constructor(value: string) {
    const valid = Object.values(values)
    if (!valid.includes(value)) {
      throw new ValidationError(`Invalid SlotStatus [${value}], must be one of "${valid.join()}"`)
    }
    super(value)
  }

  static AVAILABLE = new SlotStatus(values.AVAILABLE)
  static UNAVAILABLE = new SlotStatus(values.UNAVAILABLE)
}
