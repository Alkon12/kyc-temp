import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { UUID } from '@domain/shared/UUID'
import { UserEntity } from '@domain/user/models/UserEntity'
import { StringValue } from '@domain/shared/StringValue'
import { UserId } from '@domain/user/models/UserId'
import { ProspectActivityTypeId } from './models/ProspectActivityTypeId'
import { ProspectEntity } from './ProspectEntity'
import { ProspectActivityTypeEntity } from './ProspectActivityTypeEntity'
import { DateTimeValue } from '@domain/shared/DateTime'
import { ProspectStatusId } from './models/ProspectStatusId'
import { ProspectStatusEntity } from './ProspectStatusEntity'

export type ProspectActivityEntityProps = {
  id: UUID
  prospectId: UUID
  prospectActivityTypeId: ProspectActivityTypeId
  notes?: StringValue
  createdByUserId?: UserId
  createdAt: DateTimeValue
  prospectStatusId?: ProspectStatusId

  prospect?: ProspectEntity
  prospectActivityType?: ProspectActivityTypeEntity
  createdByUser?: UserEntity
  prospectStatus?: ProspectStatusEntity
}

export class ProspectActivityEntity extends AggregateRoot<'ProspectActivityEntity', ProspectActivityEntityProps> {
  get props(): ProspectActivityEntityProps {
    return this._props
  }

  getId() {
    return this._props.id
  }

  getProspectId() {
    return this._props.prospectId
  }

  getProspectStatusId() {
    return this._props.prospectStatusId
  }
}
