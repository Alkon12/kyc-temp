import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'
import { NumberValue } from '@domain/shared/NumberValue'

export type LocationEntityProps = {
  id: UUID
  name: StringValue
  order?: NumberValue
}

export class LocationEntity extends AggregateRoot<'LocationEntity', LocationEntityProps> {
  get props(): LocationEntityProps {
    return this._props
  }
}
