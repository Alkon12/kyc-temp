import { VehicleSmartItEntity } from "./models/VehicleSmartItEntity";

export default interface VehicleSmartItRepository {
    getVehicleByVin(vin: string): Promise<VehicleSmartItEntity | null>
}