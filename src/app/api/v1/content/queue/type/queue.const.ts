import { DataClientType } from './queue.type'

export const arrayHeadersEasy = [
  'RFC:',
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

export const regimenArraySearch = ['Regímenes', 'Obligaciones', 'Régimen Fecha Inicio Fecha Fin']

export const INITIAL_DATA_CLIENT: DataClientType = {
  CURP: '',
  'Código Postal': '',
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
  'Número Interior': '',
  'Primer Apellido': '',
  'Segundo Apellido': '',
  'Tipo de Vialidad': '',
  Regímenes: [],
  RFC: '',
}
