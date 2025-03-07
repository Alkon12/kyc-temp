import { UUID } from '@domain/shared/UUID'
import { VehicleEntity } from './models/VehicleEntity'

export default interface VehicleRepository {
  create(vehicle: VehicleEntity): Promise<VehicleEntity>
  save(vehicle: VehicleEntity): Promise<VehicleEntity>
  getById(vehicleId: UUID): Promise<VehicleEntity>
}
