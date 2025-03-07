import { DTO } from '@domain/kernel/DTO'
import AbstractPersonUpdateService from '@domain/personUpdate/PersonUpdateService'
import { IPersonUpdate } from '@type/IPersonUpdate'
import { DataClientType } from '../type/getTaxPerson.type'
import { catalogSatEnum, searchRegimen } from '../enums/catalogSat.enum'
import { forEach } from 'lodash'
import { CurpValue } from '@domain/shared/CurpValue'

export const personAdapterUpdate = (entityTax: DataClientType) => {
  let regimen = 0
  const regimenCode = entityTax.Regímenes.some((item) => item.includes(searchRegimen))
  if (regimenCode) regimen = catalogSatEnum[searchRegimen]
  else {
    const values = Object.keys(catalogSatEnum)
    for (let item in values) {
      const existRegimen = entityTax.Regímenes.find((a) => a.includes(values[item]))
      if (existRegimen) {
        regimen = catalogSatEnum[values[item]]
        break
      }
    }
  }
  const curp = new CurpValue(entityTax.CURP)

  const personUpdateDto: IPersonUpdate = {
    ApellidoMaterno: entityTax['Segundo Apellido'],
    ApellidoPaterno: entityTax['Primer Apellido'],
    Calle: entityTax['Nombre de Vialidad'],
    Ciudad: entityTax['Nombre de la Localidad'],
    CodigoPostal: entityTax['Código Postal'],
    ColoniaFraccionamiento: entityTax['Nombre de la Colonia'],
    CURP: curp.toDTO(),
    Estado: entityTax['Nombre de la Entidad Federativa'],
    Email: '',
    FechaNacimiento: curp.getDateOfBirth(),
    Nombre: entityTax['Nombre (s)'] ?? '',
    NumeroExterior: entityTax['Número Exterior'],
    NumeroCelular: '',
    NumeroInterior: entityTax['Número Interior'],
    Pais: 'México',
    RazonSocial: entityTax['Nombre Comercial'],
    RegimenFiscal: `${regimen}`,
    RFC: entityTax.RFC,
    Sexo: curp.getGender(),
    TelefonoCasa: '',
    UsoCFDI: 'G03',
    UUID: '',
  }

  return personUpdateDto
}
