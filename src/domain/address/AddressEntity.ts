import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'

import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { NumberValue } from '@domain/shared/NumberValue'

export type AddressEntityProps = {
  id: UUID
  street: StringValue
  extNumber: StringValue
  intNumber: StringValue
  zipCode: StringValue
  district: StringValue
  city: StringValue
  state: StringValue
  country: StringValue
  latitude: StringValue
  longitude: StringValue
  real_time_latitude?: StringValue;
  real_time_longitude?: StringValue; 
}

export class AddressEntity extends AggregateRoot<'AddressEntity', AddressEntityProps> {
  get props(): AddressEntityProps {
    return this._props
  }

  getId(): UUID {
    return this._props.id
  }
}
