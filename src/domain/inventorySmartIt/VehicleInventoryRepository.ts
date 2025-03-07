import { VehicleInventoryEntity } from '@domain/inventorySmartIt/VehicleInventoryEntity';

export default interface VehicleInventoryRepository {
    getAvailableInventory(): Promise<VehicleInventoryEntity[]>;
}
