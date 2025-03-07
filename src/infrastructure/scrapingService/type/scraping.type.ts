interface DataSatClient {
  curp: string
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  fechaNacimineto: string
  fechaInicioOperaciones: string
  situacionContribuyente: string
  fechaUltimoCambioSituacion: string
}

interface DataClientScraping {
  idCIF: string
  RFC: string
  CURP: string
  Nombre: string
  'Apellido Paterno': string
  'Apellido Materno': string
  'Fecha Nacimiento': string
  'Fecha de Inicio de operaciones': string
  'Situación del contribuyente': string
  'Fecha del último cambio de situación:': string
  'Entidad Federativa': string
  Colonia: string
  'Tipo de vialidad': string
  'Nombre de la vialidad': string
  'Número exterior': string
  'Número interior': string
  CP: string
  'Correo electrónico': string
  Régimen: string[]
  [key: string]: string | string[]
}
