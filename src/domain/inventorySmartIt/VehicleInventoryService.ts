import { DTO } from "@domain/kernel/DTO";
import { NumberValue } from "@domain/shared/NumberValue";
import { StringValue } from "@domain/shared/StringValue";
import { VehicleInventoryEntity } from "./VehicleInventoryEntity";

export default abstract class AbstractVehicleInventoryService {
    abstract getAvailableInventory(
        vehicleId: DTO<NumberValue>,
        vehicleBrand: DTO<StringValue>,
        vehicleModel: DTO<StringValue>,
        vehicleVersion: DTO<StringValue>,
        vehicleYear: DTO<NumberValue>,
        invoiceValue: DTO<NumberValue>,
        versionId: DTO<NumberValue>
    ): Promise<DTO<VehicleInventoryEntity[]> | null>;
}
