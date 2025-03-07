import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { TripEntity, TripEntityProps } from './TripEntity'
import { DateTimeValue } from '../shared/DateTime'
import { UserFactory } from '@domain/user/UserFactory'
import { UserId } from '@domain/user/models/UserId'
import { StringValue } from '@domain/shared/StringValue'
import { NumberValue } from '@domain/shared/NumberValue'
import { CreateTripArgs } from './interfaces/CreateTripArgs'

// export type TripArgs = Merge<TripEntityProps, {
//     // id?: UUID,
//     loggedAt?: DateTimeValue
// }>

export class TripFactory {
  static fromDTO(dto: DTO<TripEntity>): TripEntity {
    return new TripEntity({
      id: new UUID(dto.id),
      userId: new UserId(dto.userId),

      vehicleId: dto.vehicleId ? new UUID(dto.vehicleId) : undefined,
      fareCurrency: dto.fareCurrency ? new StringValue(dto.fareCurrency) : undefined,
      fareAmount: dto.fareAmount ? new NumberValue(dto.fareAmount) : undefined,
      distance: dto.distance ? new NumberValue(dto.distance) : undefined,
      duration: dto.duration ? new NumberValue(dto.duration) : undefined,

      acceptedAt: dto.acceptedAt ? new DateTimeValue(dto.acceptedAt) : undefined,
      arrivedAt: dto.arrivedAt ? new DateTimeValue(dto.arrivedAt) : undefined,
      pickupAt: dto.pickupAt ? new DateTimeValue(dto.pickupAt) : undefined,
      dropoffAt: dto.dropoffAt ? new DateTimeValue(dto.dropoffAt) : undefined,
      loggedAt: new DateTimeValue(dto.loggedAt),

      pickupLat: dto.pickupLat ? new NumberValue(dto.pickupLat) : undefined,
      pickupLng: dto.pickupLng ? new NumberValue(dto.pickupLng) : undefined,

      user: dto.user ? UserFactory.fromDTO(dto.user) : undefined,
    })
  }

  static create(args: CreateTripArgs): TripEntity {
    return new TripEntity({
      ...args,
      // id: new UUID(),
      loggedAt: new DateTimeValue(new Date()),
    })
  }
}
