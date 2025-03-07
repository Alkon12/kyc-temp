import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import AbstractVehicleSmartItService from '@domain/vehicleSmartIt/AbstractVehicleSmartItService'
import type VehicleSmartItRepository from '@domain/vehicleSmartIt/VehicleSmartItRepository'
import { VehicleSmartItEntity } from '@domain/vehicleSmartIt/models/VehicleSmartItEntity'

@injectable()
export class VehicleSmartItService extends AbstractVehicleSmartItService {
  constructor(
    @inject(DI.VehicleSmartItRepository)
    private readonly vehicleSmartItRepository: VehicleSmartItRepository,
  ) {
    super()
  }

  async getVehicleByVin(vin: string): Promise<VehicleSmartItEntity | null> {
    return this.vehicleSmartItRepository.getVehicleByVin(vin)
  }
}
