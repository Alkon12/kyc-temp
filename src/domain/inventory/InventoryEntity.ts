import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { NumberValue } from '@domain/shared/NumberValue'
import { StringValue } from '@domain/shared/StringValue'

export type InventoryEntityProps = {
  vin: StringValue
  ref: StringValue
  brand: StringValue
  model: StringValue
  version: StringValue
  year: NumberValue
  price: NumberValue
  gps: StringValue
  sim: StringValue
}

export class InventoryEntity extends AggregateRoot<'InventoryEntity', InventoryEntityProps> {
  get props(): InventoryEntityProps {
    return this._props
  }
}
