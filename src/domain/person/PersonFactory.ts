import { DTO } from '@domain/kernel/DTO'

import { StringValue } from '@domain/shared/StringValue'
import { ParamDetailFactory } from '@domain/paramdetail/ParamDetailFactory'
import { DateTimeValue } from '@domain/shared/DateTime'
import { PersonEntity } from './PersonEntity'
import { NumberValue } from '@domain/shared/NumberValue'

export class PersonFactory {
  static fromDTO(dto: DTO<PersonEntity>): PersonEntity {
    return new PersonEntity({
      id: new NumberValue(dto.id),
      name: dto.name ? new StringValue(dto.name) : undefined,
      maidenname: dto.maidenname ? new StringValue(dto.maidenname) : undefined,
      lastname: dto.lastname ? new StringValue(dto.lastname) : undefined,
      businessname: dto.businessname ? new StringValue(dto.businessname) : undefined,
      rfc: dto.rfc ? new StringValue(dto.rfc) : undefined,
      curp: dto.curp ? new StringValue(dto.curp) : undefined,
      gender: dto.gender ? new StringValue(dto.gender) : undefined,
      email: new StringValue(dto.email),
      mobile: new StringValue(dto.mobile),
      phone: dto.phone ? new StringValue(dto.phone) : undefined,
      street: dto.street ? new StringValue(dto.street) : undefined,
      noext: dto.noext ? new StringValue(dto.noext) : undefined,
      noint: dto.noint ? new StringValue(dto.noint) : undefined,
      zipCode: new NumberValue(dto.zipCode),
      district: new StringValue(dto.district),
      city: new StringValue(dto.city),
      state: new StringValue(dto.state),
      country: new StringValue(dto.country),
      birthdate: new DateTimeValue(dto.birthdate),
      cfdiuse: new StringValue(dto.cfdiuse),
      taxReg: dto.taxReg ? new StringValue(dto.taxReg) : undefined,
      userId: new StringValue(dto.userId),
    })
  }
}
