import { inject, injectable } from 'inversify'
import type VehicleReservationRepository from '@domain/vehicleReservation/VehicleReservationRepository'
import { VehicleReservationEntity } from '@domain/vehicleReservation/VehicleReservationEntity'
import { DI } from '@infrastructure'

@injectable()
export class VehicleReservationService {
  constructor(
    @inject(DI.VehicleReservationRepository)
    private readonly vehicleReservationRepository: VehicleReservationRepository,
  ) {}

  async reserveVehicle(data: {
    IdUsuarioUber: string
    IdCotizacion: number
    idsmartIt: string
  }): Promise<VehicleReservationEntity | null> {
    return this.vehicleReservationRepository.reserveVehicle(data)
  }
}
