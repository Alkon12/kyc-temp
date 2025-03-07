import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { StringValue } from '@domain/shared/StringValue'

import { ProspectStatusId } from './models/ProspectStatusId'
import { ProspectEntity } from './ProspectEntity'
import { NumberValue } from '@domain/shared/NumberValue'
import { BooleanValue } from '@domain/shared/BooleanValue'

export type ProspectStatusEntityProps = {
  id: ProspectStatusId
  name: StringValue
  order?: NumberValue
  manualAssignable: BooleanValue

  prospects: ProspectEntity[]
}

export class ProspectStatusEntity extends AggregateRoot<'ProspectStatusEntity', ProspectStatusEntityProps> {
  get props(): ProspectStatusEntityProps {
    return this._props
  }

  getId() {
    return this._props.id
  }

  getName() {
    return this._props.name
  }

  getOrder() {
    return this._props.order
  }

  isManualAssignable() {
    return !!this._props.manualAssignable.toDTO()
  }
}
