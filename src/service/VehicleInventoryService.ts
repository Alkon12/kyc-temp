import { inject, injectable } from 'inversify'
import type VehicleInventoryRepository from '@domain/inventorySmartIt/VehicleInventoryRepository'
import { VehicleInventoryEntity } from '@domain/inventorySmartIt/VehicleInventoryEntity'
import { DI } from '@infrastructure'

@injectable()
export class VehicleInventoryService {
  constructor(
    @inject(DI.VehicleInventoryRepository)
    private readonly vehicleInventoryRepository: VehicleInventoryRepository,
  ) {}

  async getAvailableInventory(): Promise<VehicleInventoryEntity[]> {
    return this.vehicleInventoryRepository.getAvailableInventory()
  }
}
