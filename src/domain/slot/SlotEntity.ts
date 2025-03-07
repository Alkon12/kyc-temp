import { DateTimeValue } from '@domain/shared/DateTime'
import { UUID } from '@domain/shared/UUID'
import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { SlotType } from './models/SlotType'
import { UserEntity } from '@domain/user/models/UserEntity'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { UserId } from '@domain/user/models/UserId'
import { ForbiddenError } from '@domain/error'
import { TaskEntity } from '@domain/task/TaskEntity'
import { ProspectEntity } from '@domain/prospect/ProspectEntity'

export type SlotEntityProps = {
  id: UUID
  slotType: SlotType
  startsAt?: DateTimeValue
  endsAt?: DateTimeValue
  hostUserId?: UserId
  guestUserId?: UserId
  free: BooleanValue
  prospectId?: UUID

  hostUser?: UserEntity
  guestUser?: UserEntity
  tasks?: TaskEntity[]
  prospect?: ProspectEntity
}

export class SlotEntity extends AggregateRoot<'SlotEntity', SlotEntityProps> {
  get props(): SlotEntityProps {
    return this.props
  }

  getId(): UUID {
    return this._props.id
  }

  getStartsAt() {
    return this._props.startsAt
  }

  getProspectId() {
    return this._props.prospectId
  }

  isFree() {
    return this._props.free.toDTO()
  }

  setAsPicked(guestUserId: UserId) {
    if (!!this._props.guestUserId) {
      throw new ForbiddenError('Slot is not free')
    }

    this._props.guestUserId = guestUserId
    this._props.free = new BooleanValue(false)
  }

  setProspectId(prospectId: UUID) {
    this._props.prospectId = prospectId
  }
}
