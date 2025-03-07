import { VehicleEntity } from "@domain/vehicle/models/VehicleEntity";
import { injectable } from "inversify";
import { DTO } from "@domain/kernel/DTO";
import { DI } from "@infrastructure";
import { VehicleSmartItEntity } from "@domain/vehicleSmartIt/models/VehicleSmartItEntity";
import container from "@infrastructure/inversify.config";
import AbstractVehicleSmartItService from "@domain/vehicleSmartIt/AbstractVehicleSmartItService";
import { ContractEntity } from "@domain/contract/ContractEntity";
import AbstractContractService from "@domain/contract/AbstractContractService";

@injectable()
export class VehicleResolvers {
    build() {
        return {
            Vehicle: {
                vehicleSmartIt: this.vehicleSmartIt,
                contract: this.contractSmartIt
            }
        }
    }

    vehicleSmartIt = async(parent: DTO<VehicleEntity>, _: unknown) : Promise<DTO<VehicleSmartItEntity> | null> => {
        const vehicleSmartItService = container.get<AbstractVehicleSmartItService>(DI.VehicleSmartItService)
        const vehicleSmartIt = await vehicleSmartItService.getVehicleByVin(parent.vin??"")

        return vehicleSmartIt ? vehicleSmartIt.toDTO() : null
    }

    contractSmartIt = async(parent: DTO<VehicleEntity>, _:unknown) : Promise<DTO<ContractEntity> | null> => {
        const contractService = container.get<AbstractContractService>(DI.ContractService)
        const contractSmartIt = await contractService.getById(parseInt(parent.contractId!))

        return contractSmartIt ? contractSmartIt.toDTO() : null

    }

}