import { DTO } from '@domain/kernel/DTO'
import type TaxPersonRepository from '@domain/taxPerson/TaxPersonRepository'
import AbstractTaxPersonService from '@domain/taxPerson/TaxPersonService'
import { StringValue } from '@domain/shared/StringValue'
import { DI } from '@infrastructure'
import { inject, injectable } from 'inversify'
import { TaxPersonEntity } from '@domain/taxPerson/TaxPersonEntity'

@injectable()
export class TaxPersonService implements AbstractTaxPersonService {
  @inject(DI.TaxPersonRepository)
  private readonly _taxPersonRepository!: TaxPersonRepository

  async createPerson(
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
  ): Promise<DTO<TaxPersonEntity>> {
    const reg = this._taxPersonRepository.CreatePerson(
      new StringValue(idCIF),
      new StringValue(RFC),
      new StringValue(CURP),
      new StringValue(nombres),
      new StringValue(primerApellido),
      new StringValue(segundoApellido),
      new StringValue(nombreComercial),
      new StringValue(códigoPostal),
      new StringValue(tipoVialidad),
      new StringValue(nombreVialidad),
      new StringValue(númeroExterior),
      new StringValue(númeroInterior),
      new StringValue(nombreColonia),
      new StringValue(nombreLocalidad),
      new StringValue(nombreMunicipioDemarcaciónTerritorial),
      new StringValue(nombreEntidadFederativa),
      new StringValue(entreCalle),
      Regímenes.map((item) => new StringValue(item)),
    )

    return reg
  }
}
