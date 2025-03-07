interface DataClient {
  idCIF: string
  RFC: string
  CURP: string
  'Nombre (s)': string
  'Primer Apellido': string
  'Segundo Apellido': string
  'Nombre Comercial': string
  'Código Postal': string
  'Tipo de Vialidad': string
  'Nombre de Vialidad': string
  'Número Exterior': string
  'Número Interior': string
  'Nombre de la Colonia': string
  'Nombre de la Localidad': string
  'Nombre del Municipio o Demarcación Territorial': string
  'Nombre de la Entidad Federativa': string
  'Entre Calle': string
  Regímenes: string[]
  [key: string]: string | string[]
}

export type DataClientType = DataClient
