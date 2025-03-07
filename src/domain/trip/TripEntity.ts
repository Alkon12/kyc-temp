import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { UUID } from '@domain/shared/UUID'
import { DateTimeValue } from '../shared/DateTime'
import { UserEntity } from '@domain/user/models/UserEntity'
import { UserId } from '@domain/user/models/UserId'
import { StringValue } from '@domain/shared/StringValue'
import { NumberValue } from '@domain/shared/NumberValue'

export type TripEntityProps = {
  id: UUID
  userId: UserId
  vehicleId?: UUID
  fareCurrency?: StringValue
  fareAmount?: NumberValue
  distance?: NumberValue
  duration?: NumberValue
  acceptedAt?: DateTimeValue
  arrivedAt?: DateTimeValue
  pickupAt?: DateTimeValue
  dropoffAt?: DateTimeValue
  pickupLat?: NumberValue
  pickupLng?: NumberValue
  loggedAt: DateTimeValue

  user?: UserEntity
}

export class TripEntity extends AggregateRoot<'TripEntity', TripEntityProps> {
  get props(): TripEntityProps {
    return this._props
  }

  getId(): UUID {
    return this._props.id
  }

  getUserId() {
    return this._props.userId
  }

  getAcceptedAt(): DateTimeValue | undefined {
    return this._props.acceptedAt
  }

  getLoggedAt(): DateTimeValue {
    return this._props.loggedAt
  }
}
