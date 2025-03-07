import { inject, injectable } from 'inversify'
import type TaxPersonRepository from './TaxPersonRepository'
import { StringValue } from '@domain/shared/StringValue'
import { TaxPersonEntity } from './TaxPersonEntity'
import { DTO } from '@domain/kernel/DTO'
import { DI } from '@infrastructure'

@injectable()
export class TaxPersonApi implements TaxPersonRepository {
  CreatePerson(
    idCIF: StringValue,
    RFC: StringValue,
    CURP: StringValue,
    nombres: StringValue,
    primerApellido: StringValue,
    segundoApellido: StringValue,
    nombreComercial: StringValue,
    códigoPostal: StringValue,
    tipoVialidad: StringValue,
    nombreVialidad: StringValue,
    númeroExterior: StringValue,
    númeroInterior: StringValue,
    nombreColonia: StringValue,
    nombreLocalidad: StringValue,
    nombreMunicipioDemarcaciónTerritorial: StringValue,
    nombreEntidadFederativa: StringValue,
    entreCalle: StringValue,
    Regímenes: StringValue[],
  ): DTO<TaxPersonEntity> {
    const data = {
      idCIF: idCIF._value,
      RFC: RFC._value,
      CURP: CURP._value,
      nombres: nombres._value,
      primerApellido: primerApellido._value,
      segundoApellido: segundoApellido._value,
      nombreComercial: nombreComercial._value,
      códigoPostal: códigoPostal._value,
      tipoVialidad: tipoVialidad._value,
      nombreVialidad: nombreVialidad._value,
      númeroExterior: númeroExterior._value,
      númeroInterior: númeroInterior._value,
      nombreColonia: nombreColonia._value,
      nombreLocalidad: nombreLocalidad._value,
      nombreMunicipioDemarcaciónTerritorial: nombreMunicipioDemarcaciónTerritorial._value,
      nombreEntidadFederativa: nombreEntidadFederativa._value,
      entreCalle: entreCalle._value,
      Regímenes: Regímenes.map((item) => item._value),
    }

    return data
  }
}
