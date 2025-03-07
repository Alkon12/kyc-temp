import { NumberValue } from '@domain/shared/NumberValue';
import { ContractEntity, DeliveryLocation } from './ContractEntity';
import { StringValue } from '@domain/shared/StringValue';
import { DateTimeValue } from '@domain/shared/DateTime';
//import { IContract } from '@type/IContract';

export interface UbicacionEntregaResponse {
    IdAgencia: number
    Id: number
    IdCategoria: number
    Ubicacion: string
    Direccion: string
    Latitud: number
    Longitud: number
}

export interface ContractResponse {
    Id: number
    IdAgencia: number
    RutaContrato: string
    RutaReferenciaBancaria: string
    RutaCartaEntrega: string
    FolioPoliza: string
    ReferenciaBancaria: string
    EstatusContrato: number
    FechaInicioContrato: string
    FechaTerminoContrato: string | undefined
    FechaEntregaUnidad: string | undefined
    NumeroSemanas: number
    Semanalidad: number
    TasaInteres: number
    IdCliente: number
    UbicacionEntrega: UbicacionEntregaResponse | undefined
}

export class ContractFactory {
    public static fromDTO(dto: ContractResponse): ContractEntity {
        return new ContractEntity({
            id: new NumberValue(dto.Id),
            companyId: new NumberValue(dto.IdAgencia),
            pathContract: new StringValue(dto.RutaContrato),
            pathBankReference: new StringValue(dto.RutaReferenciaBancaria),
            pathDeliveryLetter: new StringValue(dto.RutaCartaEntrega),
            insurancePolicyFolio: new StringValue(dto.FolioPoliza),
            banckReference: new StringValue(dto.ReferenciaBancaria),
            status: new StringValue(dto.EstatusContrato.toString()),
            startDate: new DateTimeValue(dto.FechaInicioContrato),
            endDate: dto.FechaTerminoContrato ? new DateTimeValue(dto.FechaTerminoContrato) : undefined,
            deliveryDate: dto.FechaEntregaUnidad ? new DateTimeValue(dto.FechaEntregaUnidad) : undefined,
            contractWeeks: new NumberValue(dto.NumeroSemanas),
            weeklyCost: new NumberValue(dto.Semanalidad),
            interestRate: new NumberValue(dto.TasaInteres),
            clientId: new NumberValue(dto.IdCliente),
            deliveryLocation: dto.UbicacionEntrega ? new DeliveryLocation({
                id: new NumberValue(dto.UbicacionEntrega.Id),
                companyId: new NumberValue(dto.UbicacionEntrega.IdAgencia),
                categoryId: new NumberValue(dto.UbicacionEntrega.IdCategoria),
                location: new StringValue(dto.UbicacionEntrega.Ubicacion),
                address: new StringValue(dto.UbicacionEntrega.Direccion),
                latitude: new NumberValue(dto.UbicacionEntrega.Latitud),
                longitude: new NumberValue(dto.UbicacionEntrega.Longitud)
            }) : undefined
        });
    }
}

