import { DTO } from '@domain/kernel/DTO'
import { NumberValue } from '@domain/shared/NumberValue'
import { StringValue } from '@domain/shared/StringValue'
import { ParamHeader } from '@prisma/client'
import { PersonEntity } from './PersonEntity'
import { DateTimeValue } from '@domain/shared/DateTime'

export default abstract class AbstractPersonService {
  abstract createPerson(
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
  ): Promise<DTO<PersonEntity> | null>
  abstract updateDriversLicense(
    idSmartIt: DTO<StringValue>,
    personId: DTO<NumberValue>,
    licenseNumber: DTO<StringValue>,
    expirationDate: DTO<DateTimeValue>,
  ): Promise<Boolean>
}
