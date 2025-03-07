import { StringValue } from '@domain/shared/StringValue'
import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { NumberValue } from '@domain/shared/NumberValue'
import { DateTimeValue } from '@domain/shared/DateTime'

export type PersonEntityProps = {
  id: NumberValue
  name?: StringValue
  maidenname?: StringValue
  lastname?: StringValue
  businessname?: StringValue
  rfc?: StringValue
  curp?: StringValue
  gender?: StringValue
  email: StringValue
  mobile: StringValue
  phone?: StringValue
  street?: StringValue
  noext?: StringValue
  noint?: StringValue
  zipCode: NumberValue
  district: StringValue
  city: StringValue
  state: StringValue
  country: StringValue
  birthdate: DateTimeValue
  cfdiuse: StringValue
  taxReg?: StringValue // Regimen fiscal
  userId: StringValue
}

export class PersonEntity extends AggregateRoot<'PersonEntity', PersonEntityProps> {
  get props(): PersonEntityProps {
    return this._props
  }
}
