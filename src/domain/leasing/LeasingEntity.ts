import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { UUID } from '@domain/shared/UUID'
import { DateTimeValue } from '../shared/DateTime'
import { ProductEntity } from '@domain/product/ProductEntity'
import { LocationEntity } from '@domain/location/LocationEntity'
import { UserEntity } from '@domain/user/models/UserEntity'
import { VehicleEntity } from '@domain/vehicle/models/VehicleEntity'
import { UserId } from '@domain/user/models/UserId'
import { StringValue } from '@domain/shared/StringValue'

export type LeasingEntityProps = {
  id: UUID
  friendlyId?: StringValue
  productId?: UUID
  userId: UserId
  vehicleId: UUID
  startDate: DateTimeValue
  endDate: DateTimeValue
  locationId?: UUID
  createdAt?: DateTimeValue
  updatedAt?: DateTimeValue
  expiredAt?: DateTimeValue

  user?: UserEntity
  vehicle?: VehicleEntity
  location?: LocationEntity
  product?: ProductEntity
}

export class LeasingEntity extends AggregateRoot<'LeasingEntity', LeasingEntityProps> {
  get props(): LeasingEntityProps {
    return this._props
  }

  getId() {
    return this._props.id
  }

  getFriendlyId() {
    return this._props.friendlyId
  }

  isActive() {
    return !this._props.expiredAt
  }

  getUserId() {
    return this._props.userId
  }

  getUser() {
    return this._props.user
  }

  getVehicle() {
    return this._props.vehicle
  }

  getVehicleId() {
    return this._props.vehicleId
  }

  getStartDate() {
    return this._props.startDate
  }

  getEndDate() {
    return this._props.endDate
  }
}
