import { injectable } from 'inversify'
import { StringValue } from '@domain/shared/StringValue'
import { IdentificationCardScheme, ParseService } from '@/application/service/ParseService'
import moment, { Moment } from 'moment'

@injectable()
export class CustomParser implements ParseService {
  // TODO temp since its tight to Paperless response
  async parseIdentificationCardFromText(text: StringValue): Promise<IdentificationCardScheme> {
    const schema: IdentificationCardScheme = {}

    const dataParts = text.toDTO().replaceAll('\n\n', '\n').split('\n')

    const lineForName = this.findLineFor(dataParts, 'NOMBRE')
    if (lineForName) {
      schema.lastName = this.getLine(dataParts, lineForName + 1)
      schema.middleName = this.getLine(dataParts, lineForName + 2)
      schema.firstName = this.getLine(dataParts, lineForName + 3)
    }

    const lineForDob = this.findLineFor(dataParts, 'NACIMIENTO')
    if (lineForDob) {
      const lineFull = this.getLine(dataParts, lineForDob + 1)
      if (lineFull) {
        const dob = moment(lineFull.split(' ')[0], 'DD/MM/YYYY')
        schema.dob = dob.format('YYYY-MM-DD')
      }
    }

    const lineForAddress = this.findLineFor(dataParts, 'DOMICILIO')
    if (lineForAddress) {
      const street =
        this.getLine(dataParts, lineForAddress + 1)
          ?.replaceAll(',', '')
          ?.split(' ') ?? []
      const hood =
        this.getLine(dataParts, lineForAddress + 2)
          ?.replaceAll(',', '')
          .split(' ') ?? []
      const city = this.getLine(dataParts, lineForAddress + 3)?.split(',') ?? []

      schema.addressStreetName = street.filter((_, index) => index < street.length - 1).join(' ')
      schema.addressHouseNumber = street[street.length - 1]
      schema.addressPostalCode = hood[hood.length - 1]
      schema.addressNeighborhood = hood.filter((_, index) => index < hood.length - 1).join(' ')
      schema.addressCity = city[0]
      schema.addressState = city[city.length - 1]
    }

    // // INSTITUTO NACIONAL ELECTORAL
    // // CREDENCIAL PARAVOTAR—
    // // NOMBRE
    // // CUEVAS
    // // DAMIAN
    // // JUAN CARLOS

    // // DOMICILIO
    // // C JESUS MARIA 1884207
    // // COL CENTRO 06090
    // // CUAUHTEMOC, CDMX

    // // CLAVE DE ELECTOR CVDMJN96052511H100
    // // CURP AÑO DE REGISTRO
    // // CUDJ960525HGTVMNO5 2014 02
    // // FECHADE NACIMIENTO SECCIÓN — VIGENCIA DA
    // // 25/05/1996 4757 202222092 Le

    return schema
  }

  private findLineFor(parts: string[], key: string): number | null {
    for (let line = 0; line < parts.length; line++) {
      if (parts[line].toUpperCase().includes(key.toUpperCase())) {
        return line
      }
    }

    return null
  }

  private getLine(parts: string[], line: number): string | undefined {
    return parts[line] ?? undefined
  }
}
