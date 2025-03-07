import { VehicleSmartItEntity } from "@domain/vehicleSmartIt/models/VehicleSmartItEntity";
import { VehicleSmartItFactory } from "@domain/vehicleSmartIt/VehicleSmartItFactory";
import VehicleSmartItRepository from "@domain/vehicleSmartIt/VehicleSmartItRepository";
import { injectable } from "inversify";

@injectable()
export class VehicleSmartItApi implements VehicleSmartItRepository {
    private readonly URL: string

    constructor(){
        this.URL = `${process.env.NEXT_PUBLIC_URL_SMARTIT}vehiculos`
    }

    async getVehicleByVin(vin: string): Promise<VehicleSmartItEntity | null> {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SMARTIT_API_SECRET_KEY}`
            }
        }

        const response = await fetch(`${this.URL}/${vin}`, options)
        const result = await response.json()

        if(!result) return null

        const vehicleSmartItEntity = VehicleSmartItFactory.fromDTO(result)

        return vehicleSmartItEntity

    }

}