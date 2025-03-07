import { DTO } from '@domain/kernel/DTO'
import { TaxPersonEntity } from './TaxPersonEntity'
import { StringValue } from '@domain/shared/StringValue'

export class TaxPersonFactory {
  static fromDto(dto: DTO<TaxPersonEntity>): TaxPersonEntity {
    return new TaxPersonEntity({
      CURP: dto.CURP ? new StringValue(dto.CURP) : new StringValue(''),
      códigoPostal: dto.códigoPostal ? new StringValue(dto.códigoPostal) : new StringValue(''),
      entreCalle: dto.entreCalle ? new StringValue(dto.entreCalle) : new StringValue(''),
      idCIF: dto.idCIF ? new StringValue(dto.idCIF) : new StringValue(''),
      nombreColonia: dto.nombreColonia ? new StringValue(dto.nombreColonia) : new StringValue(''),
      nombreComercial: dto.nombreComercial ? new StringValue(dto.nombreComercial) : new StringValue(''),
      nombreEntidadFederativa: dto.nombreEntidadFederativa
        ? new StringValue(dto.nombreEntidadFederativa)
        : new StringValue(''),
      nombreLocalidad: dto.nombreLocalidad ? new StringValue(dto.nombreLocalidad) : new StringValue(''),
      nombreMunicipioDemarcaciónTerritorial: dto.nombreMunicipioDemarcaciónTerritorial
        ? new StringValue(dto.nombreMunicipioDemarcaciónTerritorial)
        : new StringValue(''),
      nombres: dto.nombres ? new StringValue(dto.nombres) : new StringValue(''),
      nombreVialidad: dto.nombreVialidad ? new StringValue(dto.nombreVialidad) : new StringValue(''),
      númeroExterior: dto.númeroExterior ? new StringValue(dto.númeroExterior) : new StringValue(''),
      númeroInterior: dto.númeroInterior ? new StringValue(dto.númeroInterior) : new StringValue(''),
      primerApellido: dto.primerApellido ? new StringValue(dto.primerApellido) : new StringValue(''),
      Regímenes: dto.Regímenes ? [] : [],
      RFC: dto.RFC ? new StringValue(dto.RFC) : new StringValue(''),
      segundoApellido: dto.segundoApellido ? new StringValue(dto.segundoApellido) : new StringValue(''),
      tipoVialidad: dto.tipoVialidad ? new StringValue(dto.tipoVialidad) : new StringValue(''),
    })
  }
}
