import { catalogSatEnum, searchRegimen } from '@infrastructure/getTaxPerson/enums/catalogSat.enum'
import { IPersonUpdate } from '@type/IPersonUpdate'

export const personUpdateDto = (entity: DataClientScraping, uuid: string) => {
  let regimen = 0
  const regimenCode = entity.Régimen.some((item) => item.includes(searchRegimen))
  let regimenName = ''
  if (regimenCode) regimen = catalogSatEnum[searchRegimen]
  else {
    const values = Object.keys(catalogSatEnum)
    for (let item in values) {
      const existRegimen = entity.Régimen.find((a) => a.includes(values[item]))
      if (existRegimen) {
        regimen = catalogSatEnum[values[item]]
        regimenName = values[item]
        break
      }
    }
  }

  const personUpdate: IPersonUpdate = {
    ApellidoMaterno: entity['Apellido Materno'],
    ApellidoPaterno: entity['Apellido Paterno'],
    Calle: entity['Nombre de la vialidad'],
    Ciudad: entity['Entidad Federativa'],
    CodigoPostal: entity.CP,
    ColoniaFraccionamiento: entity.Colonia,
    CURP: entity.CURP,
    Email: '',
    Estado: entity['Entidad Federativa'],
    FechaNacimiento: '',
    Nombre: entity.Nombre,
    NumeroCelular: '',
    NumeroExterior: entity['Número exterior'],
    NumeroInterior: entity['Número interior'],
    Pais: entity['Entidad Federativa'],
    RazonSocial: '',
    RegimenFiscal: `${regimen}-${regimenName}`,
    RFC: entity.RFC,
    Sexo: '',
    TelefonoCasa: '',
    UsoCFDI: 'G03',
    UUID: uuid,
  }

  return personUpdate
}
