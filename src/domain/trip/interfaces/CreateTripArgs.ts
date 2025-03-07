import { DateTimeValue } from '@domain/shared/DateTime'
import { UUID } from '@domain/shared/UUID'
import { TripEntityProps } from '../TripEntity'

export type CreateTripArgs = Merge<
  TripEntityProps,
  {
    id: UUID
    loggedAt?: DateTimeValue
  }
>
