import { ValueObject } from '@domain/kernel/ValueObject'

export class VehicleColor extends ValueObject<'VehicleColor', string> {
  constructor(value: string) {
    super(value)
  }
}
