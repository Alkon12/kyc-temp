type CatalogSatType = {
  'Personas Morales con Fines no Lucrativos': number
  'Sueldos y Salarios e Ingresos Asimilados a Salarios': number
  Arrendamiento: number
  'Régimen de Enajenación o Adquisición de Bienes': number
  'Demás ingresos': number
  'Residentes en el Extranjero sin Establecimiento Permanente en México': number
  'Ingresos por Dividendos (socios y accionistas)': number
  'Personas Físicas con Actividades Empresariales y Profesionales': number
  'Ingresos por intereses': number
  'Régimen de los ingresos por obtención de premios': number
  'Sin obligaciones fiscales': number
  'Sociedades Cooperativas de Producción que optan por diferir sus ingresos': number
  'Incorporación Fiscal': number
  'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras': number
  'Opcional para Grupos de Sociedades': number
  Coordinados: number
  'Régimen Simplificado de Confianza (RESICO)': number
  'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas': number
  [key: string]: number
}

export const catalogSatEnum: CatalogSatType = {
  'Personas Morales con Fines no Lucrativos': 603,
  'Sueldos y Salarios e Ingresos Asimilados a Salarios': 605,
  Arrendamiento: 606,
  'Régimen de Enajenación o Adquisición de Bienes': 607,
  'Demás ingresos': 608,
  'Residentes en el Extranjero sin Establecimiento Permanente en México': 610,
  'Ingresos por Dividendos (socios y accionistas)': 611,
  'Personas Físicas con Actividades Empresariales y Profesionales': 612,
  'Ingresos por intereses': 614,
  'Régimen de los ingresos por obtención de premios': 615,
  'Sin obligaciones fiscales': 616,
  'Sociedades Cooperativas de Producción que optan por diferir sus ingresos': 620,
  'Incorporación Fiscal': 621,
  'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras': 622,
  'Opcional para Grupos de Sociedades': 623,
  Coordinados: 624,
  'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas': 625,
  'Régimen Simplificado de Confianza (RESICO)': 626,
}

export const searchRegimen =
  'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas'
