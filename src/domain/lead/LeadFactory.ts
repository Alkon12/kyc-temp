import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { LeadEntity, LeadEntityProps } from './LeadEntity'
import { BooleanValue } from '../shared/BooleanValue'
import { DateTimeValue } from '../shared/DateTime'
import { LocationFactory } from '@domain/location/LocationFactory'
import { Email } from '@domain/shared/Email'
import { LeadStatus } from './LeadStatus'
import { PhoneNumber } from '@domain/shared/PhoneNumber'
import { UberDriverRating } from '@domain/shared/UberDriverRating'
import { UserFactory } from '@domain/user/UserFactory'

export type LeadArgs = Merge<
  LeadEntityProps,
  {
    id?: UUID
  }
>

export class LeadFactory {
  static fromDTO(dto: DTO<LeadEntity>): LeadEntity {
    return new LeadEntity({
      id: new UUID(dto.id),
      firstName: dto.firstName ? new StringValue(dto.firstName) : undefined,
      lastName: dto.lastName ? new StringValue(dto.lastName) : undefined,
      email: dto.email ? new Email(dto.email) : undefined,
      phoneNumber: dto.phoneNumber ? new PhoneNumber(dto.phoneNumber) : undefined,
      contactype: dto.contactype ? new StringValue(dto.contactype) : undefined,
      hasUberAccount: dto.hasUberAccount ? new BooleanValue(dto.hasUberAccount) : new BooleanValue(false),
      uberDriverId: dto.uberDriverId ? new StringValue(dto.uberDriverId) : undefined,
      uberRating: dto.uberRating ? new UberDriverRating(dto.uberRating) : undefined,
      createdAt: dto.createdAt ? new DateTimeValue(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new DateTimeValue(dto.updatedAt) : undefined,
      locationId: dto.locationId ? new StringValue(dto.locationId) : undefined,
      productOfInterestId: dto.productOfInterestId ? new StringValue(dto.productOfInterestId) : undefined,
      visitAppointmentAt: dto.visitAppointmentAt ? new DateTimeValue(dto.visitAppointmentAt) : undefined,

      isBot: dto.isBot ? new BooleanValue(dto.isBot) : new BooleanValue(false),
      browserName: dto.browserName ? new StringValue(dto.browserName) : undefined,
      browserVersion: dto.browserVersion ? new StringValue(dto.browserVersion) : undefined,
      deviceModel: dto.deviceModel ? new StringValue(dto.deviceModel) : undefined,
      deviceType: dto.deviceType ? new StringValue(dto.deviceType) : undefined,
      deviceVendor: dto.deviceVendor ? new StringValue(dto.deviceVendor) : undefined,
      engineName: dto.engineName ? new StringValue(dto.engineName) : undefined,
      engineVersion: dto.engineVersion ? new StringValue(dto.engineVersion) : undefined,

      countryCode: dto.countryCode ? new StringValue(dto.countryCode) : undefined,

      location: dto.location ? LocationFactory.fromDTO(dto.location) : undefined,
      supportUser: dto.supportUser ? UserFactory.fromDTO(dto.supportUser) : undefined,
      status: new LeadStatus(dto.status),
    })
  }

  static create(args: LeadArgs): LeadEntity {
    return new LeadEntity({
      id: new UUID(),
      ...args,
    })
  }
}
