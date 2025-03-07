import { injectable } from 'inversify'
import {
  MutationAssignTrackerDeviceSimToVehicleArgs,
  MutationAssignTrackerDeviceToVehicleArgs,
  MutationReserveVehicleArgs,
} from '../app.schema.gen'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import { ApiContext } from '@api/shared/Api'
import { VehicleEntity } from '@domain/vehicle/models/VehicleEntity'
import AbstractInventoryService from '@domain/inventory/InventoryService'
import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'
import { VehicleVin } from '@domain/shared/VehicleVin'

@injectable()
export class InventoryResolvers {
  build() {
    return {
      Query: {},
      Mutation: {
        reserveVehicle: this.reserveVehicle,
        assignTrackerDeviceToVehicle: this.assignTrackerDeviceToVehicle,
        assignTrackerDeviceSimToVehicle: this.assignTrackerDeviceSimToVehicle,
      },
    }
  }

  reserveVehicle = async (
    _parent: unknown,
    { taskId, input }: MutationReserveVehicleArgs,
    context: ApiContext,
  ): Promise<DTO<VehicleEntity> | null> => {
    const inventoryService = container.get<AbstractInventoryService>(DI.InventoryService)

    const vehicle = await inventoryService.reserveVehicle(
      context.userId,
      new UUID(taskId),
      new VehicleVin(input.vin),
      new StringValue(input.contractId),
    )

    return vehicle.toDTO()
  }

  assignTrackerDeviceToVehicle = async (
    _parent: unknown,
    { taskId, trackerDeviceId }: MutationAssignTrackerDeviceToVehicleArgs,
    context: ApiContext,
  ): Promise<DTO<VehicleEntity> | null> => {
    const inventoryService = container.get<AbstractInventoryService>(DI.InventoryService)

    const vehicle = await inventoryService.assignTrackerDeviceToVehicle(
      context.userId,
      new UUID(taskId),
      new StringValue(trackerDeviceId),
    )

    return vehicle.toDTO()
  }

  assignTrackerDeviceSimToVehicle = async (
    _parent: unknown,
    { taskId, trackerDeviceSim }: MutationAssignTrackerDeviceSimToVehicleArgs,
    context: ApiContext,
  ): Promise<DTO<VehicleEntity> | null> => {
    const inventoryService = container.get<AbstractInventoryService>(DI.InventoryService)

    const vehicle = await inventoryService.assignTrackerDeviceSimToVehicle(
      context.userId,
      new UUID(taskId),
      new StringValue(trackerDeviceSim),
    )

    return vehicle.toDTO()
  }
}
