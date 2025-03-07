import { StringValue } from "@domain/shared/StringValue";
import { VehicleSmartItEntity } from "./models/VehicleSmartItEntity";
import { NumberValue } from "@domain/shared/NumberValue";
import { VehicleColorSmartIt } from "./models/VehicleColorSmartIt";
import { GPSSmartIt } from "./models/GPSSmartIt";
import { SIMCardSmartIt } from "./models/SIMCardSmartIt";

export interface SIMCardSmartItReponse {
    Id: number
    NumeroSerie: string
    NumeroTelefono: string
}

export interface GPSSmartItResponse {
    Id: number
    NumeroParte: number
    NumeroSerie: string
    IMEI: string
    SIMCard: SIMCardSmartItReponse
}

export interface VehicleColorSmartItResponse {
    Interior: string
    Exterior: string
}

export interface VehicleSmartItResponse {
    NumeroDeSerie: string
    NumeroInventario: number
    IdVehiculo: number
    MarcaVehiculo: string
    VehiculoModelo: string
    VehiculoVersion: string
    AnioVehiculo: number
    valor_factura: number
    IdVersion: number
    Estatus: string
    Placa: string
    Color: VehicleColorSmartItResponse
    GPS: GPSSmartItResponse
}

export class VehicleSmartItFactory {
    public static fromDTO(dto: VehicleSmartItResponse): VehicleSmartItEntity {
        return new VehicleSmartItEntity({
            serialNumber: new StringValue(dto.NumeroDeSerie),
            inventoryId: new NumberValue(dto.NumeroInventario),
            vehicleSmartItId: new NumberValue(dto.IdVehiculo),
            brand: new StringValue(dto.MarcaVehiculo),
            model: new StringValue(dto.VehiculoModelo),
            version: new StringValue(dto.VehiculoVersion),
            year: new NumberValue(dto.AnioVehiculo),
            cost: new NumberValue(dto.valor_factura),
            versionId: new NumberValue(dto.IdVersion),
            status: new StringValue(dto.Estatus),
            numberPlates: new StringValue(dto.Placa),
            color: new VehicleColorSmartIt({
                internal: new StringValue(dto.Color.Interior),
                external: new StringValue(dto.Color.Exterior)
            }),
            gps: dto.GPS ? new GPSSmartIt({
                id: new NumberValue(dto.GPS.Id),
                partNumber: new StringValue(dto.GPS.NumeroParte.toString()),
                serialNumber: new StringValue(dto.GPS.NumeroSerie),
                imei: new StringValue(dto.GPS.IMEI),
                simCard: dto.GPS.SIMCard ? new SIMCardSmartIt({
                    id: new NumberValue(dto.GPS.SIMCard.Id),
                    serialNumber: new StringValue(dto.GPS.SIMCard.NumeroSerie),
                    phoneNumber: new StringValue(dto.GPS.SIMCard.NumeroTelefono)
                }) : undefined
            }) : undefined
        })
    }
}
