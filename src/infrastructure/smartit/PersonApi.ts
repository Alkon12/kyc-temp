import { injectable } from 'inversify'
import { nullsToUndefined } from '@/client/utils/nullToUndefined'
import { StringValue } from '@domain/shared/StringValue'
import { NumberValue } from '@domain/shared/NumberValue'
import PersonRepository from '@domain/person/PersonRepository'
import { DateTimeValue } from '@domain/shared/DateTime'
import { PersonEntity } from '@domain/person/PersonEntity'
import { PersonFactory } from '@domain/person/PersonFactory'
import { IPerson } from '@type/entities'

@injectable()
export class PersonApi implements PersonRepository {
  async createPerson(
    name: StringValue,
    maidenname: StringValue,
    lastname: StringValue,
    businessname: StringValue,
    rfc: StringValue,
    curp: StringValue,
    gender: StringValue,
    email: StringValue,
    mobile: StringValue,
    phone: StringValue,
    street: StringValue,
    noext: StringValue,
    noint: StringValue,
    zipCode: NumberValue,
    district: StringValue,
    city: StringValue,
    state: StringValue,
    country: StringValue,
    birthdate: DateTimeValue,
    cfdiuse: StringValue,
    taxReg: StringValue,
    userId: StringValue,
  ): Promise<PersonEntity | null> {
    let URL = `${process.env.NEXT_PUBLIC_URL_SMARTIT}/persona`
    const data = {
      Nombre: name._value,
      ApellidoPaterno: maidenname._value,
      ApellidoMaterno: lastname._value,
      RazonSocial: businessname._value,
      RFC: rfc._value,
      CURP: curp._value,
      Sexo: gender._value,
      Email: email._value,
      NumeroCelular: mobile._value,
      TelefonoCasa: phone._value,
      Calle: street._value,
      NumeroExterior: noext._value,
      NumeroInterior: noint._value,
      CodigoPostal: zipCode._value,
      ColoniaFraccionamiento: district._value,
      Ciudad: city._value,
      Estado: state._value,
      Pais: country._value,
      FechaNacimiento: birthdate._value,
      UsoCFDI: cfdiuse._value,
      RegimenFiscal: taxReg._value,
      idGUID: userId._value,
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SMARTIT_API_SECRET_KEY}`,
      },
      body: JSON.stringify(data),
    }

    const response = await fetch(URL, options)

    const respuesta = await response.json()

    if (respuesta.TipoRespuesta != '1') {
      throw respuesta.Descripcion
    }

    const x = {
      id: respuesta.Objeto,
      name: name,
      maidenname: maidenname._value,
      lastname: lastname._value,
      businessname: businessname._value,
      rfc: rfc._value,
      curp: curp._value,
      gender: gender._value,
      email: email._value,
      mobile: mobile._value,
      phone: phone._value,
      street: street._value,
      noext: noext._value,
      noint: noint._value,
      zipCode: zipCode._value,
      district: district._value,
      city: city._value,
      state: state._value,
      country: country._value,
      birthdate: birthdate._value,
      cfdiuse: cfdiuse._value,
      taxReg: taxReg._value,
      userId: userId._value,
    }

    return PersonFactory.fromDTO(nullsToUndefined(x as unknown as IPerson))
  }

  async updateDriversLicense(
    idSmartIt: StringValue,
    personId: NumberValue,
    licenseNumber: StringValue,
    expirationDate: DateTimeValue,
  ): Promise<Boolean> {
    let URL = `${process.env.NEXT_PUBLIC_URL_SMARTIT}licencia-conducir`

    const data = {
      IdPersona: personId.toDTO(),
      NumeroLicencia: licenseNumber.toDTO(),
      Vigencia: expirationDate.toDTO(),
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idSmartIt.toDTO()}`,
      },
      body: JSON.stringify(data),
    }

    const response = await fetch(URL, options)
    const jsonData = await response.json()

    if (!response.ok) {
      console.log(`(${response.status}) ${response.statusText}`)
      return false
    }

    return jsonData
  }
}
