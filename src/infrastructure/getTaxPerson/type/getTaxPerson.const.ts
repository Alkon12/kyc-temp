import { DataClientType } from './getTaxPerson.type'

export const arrayHeadersEasy = [
  'CURP',
  'Nombre (s)',
  'Primer Apellido',
  'Segundo Apellido',
  'Nombre Comercial',
  'Entre Calle',
  'idCIF',
  'RFC',
]

export const arrayHeaderHard = [
  'Código Postal',
  'Nombre de Vialidad',
  'Número Interior',
  'Nombre de la Localidad',
  'Nombre de la Entidad Federativa',
]

export const deleteString = [
  'Tipo de Vialidad',
  'Número Exterior',
  'Nombre de la Colonia',
  'Nombre del Municipio o Demarcación Territorial',
  'Entre Calle',
]

export const regimenArraySearch = [
  'Regímenes',
  'Obligaciones',
  'Régimen Fecha Inicio Fecha Fin',
  'Sus datos personales son incorporados y protegidos en los sistemas del SAT, de conformidad con los Lineamientos de Protección de Datos',
]

export const INITIAL_DATA_CLIENT: DataClientType = {
  CURP: '',
  'Código Postal': '',
  // 'Codigo Postal': '',
  'Entre Calle': '',
  idCIF: '',
  'Nombre (s)': '',
  'Nombre Comercial': '',
  'Nombre de la Colonia': '',
  'Nombre de la Entidad Federativa': '',
  'Nombre de la Localidad': '',
  'Nombre de Vialidad': '',
  'Nombre del Municipio o Demarcación Territorial': '',
  'Número Exterior': '',
  // 'Numero Exterior': '',
  'Número Interior': '',
  // 'Numero Interior': '',
  'Primer Apellido': '',
  'Segundo Apellido': '',
  'Tipo de Vialidad': '',
  Regímenes: [],
  RFC: '',
}
