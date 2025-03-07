import { DateTimeValue } from '@domain/shared/DateTime'
import { StringValue } from '@domain/shared/StringValue'
import { PersonEntity } from './PersonEntity'
import { NumberValue } from '@domain/shared/NumberValue'

export default interface PersonRepository {
  createPerson(
    name: StringValue,
    madeinname: StringValue,
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
  ): Promise<PersonEntity | null>

  updateDriversLicense(
    idsmartIt: StringValue,
    personId: NumberValue,
    licenseNumber: StringValue,
    expirationDate: DateTimeValue,
  ): Promise<Boolean>
}
