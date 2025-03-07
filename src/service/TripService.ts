import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import AbstractTripService from '@domain/trip/TripService'
import { TripEntity } from '@domain/trip/TripEntity'
import type TripRepository from '@domain/trip/TripRepository'
import { TripFactory } from '@domain/trip/TripFactory'
import { UserId } from '@domain/user/models/UserId'
import { UUID } from '@domain/shared/UUID'
import { CreateTripArgs } from '@domain/trip/interfaces/CreateTripArgs'
import type LeasingRepository from '@domain/leasing/LeasingRepository'
import { DateTimeValue } from '@domain/shared/DateTime'

@injectable()
export class TripService implements AbstractTripService {
  @inject(DI.TripRepository) private readonly _tripRepository!: TripRepository
  @inject(DI.LeasingRepository)
  private readonly _leasingRepository!: LeasingRepository

  async create(props: CreateTripArgs): Promise<TripEntity> {
    const prepareTrip = TripFactory.create(props)

    return this._tripRepository.create(prepareTrip)
  }

  async getById(tripId: UUID): Promise<TripEntity | null> {
    return this._tripRepository.getById(tripId)
  }

  async getByUser(userId: UserId): Promise<TripEntity[]> {
    return this._tripRepository.getByUser(userId)
  }

  async getByDateRange(leasingId: UUID, from: DateTimeValue, to: DateTimeValue): Promise<TripEntity[]> {
    const leasing = await this._leasingRepository.getById(leasingId)

    return this._tripRepository.getByDateRange(leasing.getUserId(), from, to)
  }
}
