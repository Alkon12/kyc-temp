import { ValidationError } from '@domain/error/ValidationError'
import { ValueObject } from '@domain/kernel/ValueObject'

const values = {
  ARRIVED: 'ARRIVED',
  CONTACTED: 'CONTACTED',
  DISMISSED: 'DISMISSED',
  CONVERTED: 'CONVERTED',
}

export class LeadStatus extends ValueObject<'LeadStatus', string> {
  constructor(value: string) {
    const valid = Object.values(values)
    if (!valid.includes(value)) {
      throw new ValidationError(`Invalid LeadStatus [${value}], must be one of "${valid.join()}"`)
    }
    super(value)
  }

  static ARRIVED = new LeadStatus(values.ARRIVED)
  static CONTACTED = new LeadStatus(values.CONTACTED)
  static DISMISSED = new LeadStatus(values.DISMISSED)
  static CONVERTED = new LeadStatus(values.CONVERTED)
}
