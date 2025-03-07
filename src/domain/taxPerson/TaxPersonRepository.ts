import { StringValue } from '@domain/shared/StringValue'
import { TaxPersonEntity } from './TaxPersonEntity'
import { DTO } from '@domain/kernel/DTO'

export default interface TaxPersonRepository {
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
  ): DTO<TaxPersonEntity>
}
