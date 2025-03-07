import { ValueObject } from '@domain/kernel/ValueObject'
import { ValidationError } from '@domain/error/ValidationError'

export const TYPES = {
  KYC_MEET: 'KYC_MEET',
  VEHICLE_DELIVERY_MEET: 'VEHICLE_DELIVERY_MEET',
}

export class SlotType extends ValueObject<'SlotType', string> {
  constructor(value: string) {
    const valid = Object.values(TYPES)
    if (!valid.includes(value)) {
      throw new ValidationError(`Invalid Slot Type [${value}], must be one of "${valid.join()}"`)
    }
    super(value)
  }

  static get(value: SlotType | string): SlotType {
    return typeof value === 'string' ? new SlotType(value) : value
  }

  static KYC_MEET = new SlotType(TYPES.KYC_MEET)
  static VEHICLE_DELIVERY_MEET = new SlotType(TYPES.VEHICLE_DELIVERY_MEET)
}
