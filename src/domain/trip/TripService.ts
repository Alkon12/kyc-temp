import { TripEntity } from './TripEntity'
import { UUID } from '@domain/shared/UUID'
import { UserId } from '@domain/user/models/UserId'
import { CreateTripArgs } from './interfaces/CreateTripArgs'
import { StringValue } from '@domain/shared/StringValue'
import { DateTimeValue } from '@domain/shared/DateTime'

export default abstract class AbstractTripService {
  abstract create(props: CreateTripArgs): Promise<TripEntity>
  abstract getByUser(userId: UserId): Promise<TripEntity[]>
  abstract getById(tripId: UUID): Promise<TripEntity | null>
  abstract getByDateRange(leasingId: UUID, from: DateTimeValue, to: DateTimeValue): Promise<TripEntity[]>
}
