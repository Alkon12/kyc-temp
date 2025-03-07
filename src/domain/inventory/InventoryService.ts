import { StringValue } from '@domain/shared/StringValue'
import { UserId } from '@domain/user/models/UserId'
import { UUID } from '@domain/shared/UUID'
import { VehicleEntity } from '@domain/vehicle/models/VehicleEntity'
import { VehicleVin } from '@domain/shared/VehicleVin'

export default abstract class AbstractInventoryService {
  abstract reserveVehicle(
    userId: UserId,
    taskId: UUID,
    vin: VehicleVin,
    contractId: StringValue,
  ): Promise<VehicleEntity>
  abstract assignTrackerDeviceToVehicle(
    userId: UserId,
    taskId: UUID,
    trackerDeviceId: StringValue,
  ): Promise<VehicleEntity>
  abstract assignTrackerDeviceSimToVehicle(
    userId: UserId,
    taskId: UUID,
    trackerDeviceSim: StringValue,
  ): Promise<VehicleEntity>
}
