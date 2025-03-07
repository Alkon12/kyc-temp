import { inject, injectable } from 'inversify'
import { VehicleReservationEntity } from '@domain/vehicleReservation/VehicleReservationEntity'
import type { VehicleReservationService } from '@service/VehicleReservationService'
import { DI } from '@infrastructure'

@injectable()
export class VehicleReservationResolvers {
  constructor(
    @inject(DI.VehicleReservationService)
    private readonly vehicleReservationService: VehicleReservationService,
  ) {}

  build() {
    return {
      Mutation: {
        reserveVehicleSmarIt: this.reserveVehicleSmarIt,
      },
    }
  }

  private reserveVehicleSmarIt = async (
    _parent: unknown,
    {
      idsmartIt,
      IdUsuarioUber,
      IdCotizacion,
    }: {
      idsmartIt: string
      IdUsuarioUber: string
      IdCotizacion: number
    },
  ): Promise<VehicleReservationEntity | null> => {
    const data = { IdUsuarioUber, IdCotizacion, idsmartIt }

    return await this.vehicleReservationService.reserveVehicle(data)
  }
}
