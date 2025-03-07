import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { NumberValue } from '@domain/shared/NumberValue'
import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'

export type UberRegistrySmartItEntityProps = {
  id: NumberValue
  rfc?: StringValue
  curp?: StringValue
  name: StringValue
  lastName: StringValue
  secondLastName?: StringValue
  userId: UUID
  termsId?: UUID
  vin: StringValue
  quoteSmartItId: NumberValue
  contractId: NumberValue
  status: StringValue
}

export class UberRegistrySmartItEntity extends AggregateRoot<
  'UberRegistrySmartItEntity',
  UberRegistrySmartItEntityProps
> {
  get props(): UberRegistrySmartItEntityProps {
    return this._props
  }
}
