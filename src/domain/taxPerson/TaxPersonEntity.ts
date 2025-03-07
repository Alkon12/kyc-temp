import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { StringValue } from '@domain/shared/StringValue'

type TaxPersonProps = {
  idCIF: StringValue
  RFC: StringValue
  CURP: StringValue
  nombres: StringValue
  primerApellido: StringValue
  segundoApellido: StringValue
  nombreComercial: StringValue
  códigoPostal: StringValue
  tipoVialidad: StringValue
  nombreVialidad: StringValue
  númeroExterior: StringValue
  númeroInterior: StringValue
  nombreColonia: StringValue
  nombreLocalidad: StringValue
  nombreMunicipioDemarcaciónTerritorial: StringValue
  nombreEntidadFederativa: StringValue
  entreCalle: StringValue
  Regímenes: StringValue[]
}

export class TaxPersonEntity extends AggregateRoot<'TaxPersonEntity', TaxPersonProps> {
  get props(): TaxPersonProps {
    return this._props
  }
}
