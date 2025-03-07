import { injectable } from "inversify";
import { VehicleSmartItEntity } from "./models/VehicleSmartItEntity";

@injectable()
export default abstract class AbstractVehicleSmartItService {
    abstract getVehicleByVin(vin: string): Promise<VehicleSmartItEntity | null>
}