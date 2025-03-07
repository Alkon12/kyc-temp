import { UberRegistrySmartItEntity } from './UberRegistrySmartItEntity'
import { NumberValue } from '@domain/shared/NumberValue'
import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'

export interface UberRegistrySmartItResponse {
  Id: number
  RFC: string
  CURP: string
  Nombre: string
  ApellidoPaterno: string
  ApellidoMaterno: string
  UUID: string
  TermsID: string
  NumeroSerie: string
  IdCotizacion: number
  IdContrato: number
  Estatus: string
}

export class UberRegistrySmartItFactory {
  public static fromDTO(dto: UberRegistrySmartItResponse): UberRegistrySmartItEntity {
    return new UberRegistrySmartItEntity({
      id: new NumberValue(dto.Id),
      rfc: new StringValue(dto.RFC),
      curp: dto.CURP ? new StringValue(dto.CURP) : undefined,
      name: new StringValue(dto.Nombre),
      lastName: new StringValue(dto.ApellidoPaterno),
      secondLastName: new StringValue(dto.ApellidoMaterno),
      userId: new UUID(dto.UUID),
      termsId: new UUID(dto.TermsID),
      vin: new StringValue(dto.NumeroSerie),
      quoteSmartItId: new NumberValue(dto.IdCotizacion),
      contractId: new NumberValue(dto.IdContrato),
      status: new StringValue(dto.Estatus),
    })
  }
}
