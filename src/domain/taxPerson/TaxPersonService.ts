import { DTO } from '@domain/kernel/DTO'
import { TaxPersonEntity } from './TaxPersonEntity'
import { StringValue } from '@domain/shared/StringValue'

export default abstract class AbstractTaxPersonService {
  abstract createPerson(
    idCIF: DTO<StringValue>,
    RFC: DTO<StringValue>,
    CURP: DTO<StringValue>,
    nombres: DTO<StringValue>,
    primerApellido: DTO<StringValue>,
    segundoApellido: DTO<StringValue>,
    nombreComercial: DTO<StringValue>,
    códigoPostal: DTO<StringValue>,
    tipoVialidad: DTO<StringValue>,
    nombreVialidad: DTO<StringValue>,
    númeroExterior: DTO<StringValue>,
    númeroInterior: DTO<StringValue>,
    nombreColonia: DTO<StringValue>,
    nombreLocalidad: DTO<StringValue>,
    nombreMunicipioDemarcaciónTerritorial: DTO<StringValue>,
    nombreEntidadFederativa: DTO<StringValue>,
    entreCalle: DTO<StringValue>,
    Regímenes: DTO<StringValue[]>,
  ): Promise<DTO<TaxPersonEntity>>
}
