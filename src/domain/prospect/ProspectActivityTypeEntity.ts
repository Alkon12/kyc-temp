import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { StringValue } from '@domain/shared/StringValue'
import { ProspectActivityTypeId } from './models/ProspectActivityTypeId'
import { ProspectActivityEntity } from './ProspectActivityEntity'

export type ProspectActivityTypeEntityProps = {
  id: ProspectActivityTypeId
  name: StringValue

  prospectActivity: ProspectActivityEntity[]
}

export class ProspectActivityTypeEntity extends AggregateRoot<
  'ProspectActivityTypeEntity',
  ProspectActivityTypeEntityProps
> {
  get props(): ProspectActivityTypeEntityProps {
    return this._props
  }
}
