import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import { StringValue } from '@domain/shared/StringValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { NumberValue } from '@domain/shared/NumberValue'
import AbstractPersonService from '@domain/person/PersonService'
import type PersonRepository from '@domain/person/PersonRepository'
import { PersonEntity } from '@domain/person/PersonEntity'

@injectable()
export class PersonService implements AbstractPersonService {
  @inject(DI.PersonRepository)
  private readonly _personRepository!: PersonRepository

  async createPerson(
    name: DTO<StringValue>,
    madeinname: DTO<StringValue>,
    lastname: DTO<StringValue>,
    businessname: DTO<StringValue>,
    rfc: DTO<StringValue>,
    curp: DTO<StringValue>,
    gender: DTO<StringValue>,
    email: DTO<StringValue>,
    mobile: DTO<StringValue>,
    phone: DTO<StringValue>,
    street: DTO<StringValue>,
    noext: DTO<StringValue>,
    noint: DTO<StringValue>,
    zipCode: DTO<NumberValue>,
    district: DTO<StringValue>,
    city: DTO<StringValue>,
    state: DTO<StringValue>,
    country: DTO<StringValue>,
    birthdate: DTO<DateTimeValue>,
    cfdiuse: DTO<StringValue>,
    taxReg: DTO<StringValue>,
    userId: DTO<StringValue>,
  ): Promise<DTO<PersonEntity> | null> {
    const reg = await this._personRepository.createPerson(
      new StringValue(name),
      new StringValue(madeinname),
      new StringValue(lastname),
      new StringValue(businessname),
      new StringValue(rfc),
      new StringValue(curp),
      new StringValue(gender),
      new StringValue(email),
      new StringValue(mobile),
      new StringValue(phone),
      new StringValue(street),
      new StringValue(noext),
      new StringValue(noint),
      new NumberValue(zipCode),
      new StringValue(district),
      new StringValue(city),
      new StringValue(state),
      new StringValue(country),
      new DateTimeValue(birthdate),
      new StringValue(cfdiuse),
      new StringValue(taxReg),
      new StringValue(userId),
    )

    return reg && reg.toDTO()
  }

  async updateDriversLicense(
    idsmartIt: DTO<StringValue>,
    personId: DTO<NumberValue>,
    licenseNumber: DTO<StringValue>,
    expirationDate: DTO<DateTimeValue>,
  ): Promise<Boolean> {
    return this._personRepository.updateDriversLicense(
      new StringValue(idsmartIt),
      new NumberValue(personId),
      new StringValue(licenseNumber),
      new DateTimeValue(expirationDate),
    )
  }
}
