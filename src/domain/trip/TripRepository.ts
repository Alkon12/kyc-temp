import { TripEntity } from '@/domain/trip/TripEntity'
import { UUID } from '@domain/shared/UUID'
import { UserId } from '@domain/user/models/UserId'
import { StringValue } from '@domain/shared/StringValue'
import { DateTimeValue } from '@domain/shared/DateTime'

export default interface TripRepository {
  create(trip: TripEntity): Promise<TripEntity>
  save(trip: TripEntity): Promise<TripEntity>
  getById(tripId: UUID): Promise<TripEntity | null>
  getByUser(userId: UserId): Promise<TripEntity[]>
  getAll(): Promise<TripEntity[]>
  getByDateRange(userId: UserId, from: DateTimeValue, to: DateTimeValue): Promise<TripEntity[]>
}
