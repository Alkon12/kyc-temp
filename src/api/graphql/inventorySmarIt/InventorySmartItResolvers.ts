import { injectable, inject } from 'inversify'
import { VehicleInventoryService } from '@service/VehicleInventoryService'
import { DI } from '@infrastructure'

@injectable()
export class VehicleInventoryResolvers {
  constructor(
    @inject(DI.VehicleInventoryService)
    private readonly vehicleInventoryService: VehicleInventoryService,
  ) {}

  build() {
    return {
      Query: {
        getAvailableInventory: this.getAvailableInventory,
      },
    }
  }

  private getAvailableInventory = async () => {
    return await this.vehicleInventoryService.getAvailableInventory()
  }
}
