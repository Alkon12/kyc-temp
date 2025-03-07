import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { UserEntity, UserEntityProps } from './models/UserEntity'
import { BooleanValue } from '../shared/BooleanValue'
import { DateTimeValue } from '../shared/DateTime'
import { StringValue } from '@domain/shared/StringValue'
import { UberDriverRating } from '@domain/shared/UberDriverRating'
import { UserGroupFactory } from './UserGroupFactory'
import { TaskFactory } from '@domain/task/TaskFactory'
import { QuoteFactory } from '@domain/quote/QuoteFactory'
import { UserId } from './models/UserId'
import { ApplicationFactory } from '@domain/application/ApplicationFactory'
import { PhoneNumber } from '@domain/shared/PhoneNumber'
import { Email } from '@domain/shared/Email'
import { LeasingFactory } from '@domain/leasing/LeasingFactory'
import { AccountFactory } from './AccountFactory'
import { NumberValue } from '@domain/shared/NumberValue'

export type UserArgs = Merge<
  Omit<UserEntityProps, 'quotes' | 'assignedTasks' | 'groups' | 'applications' | 'leasings' | 'accounts'>,
  {
    id?: UUID
    createdAt?: DateTimeValue
  }
>

export class UserFactory {
  static fromDTO(dto: DTO<UserEntity>): UserEntity {
    return new UserEntity({
      id: new UserId(dto.id),
      firstName: dto.firstName ? new StringValue(dto.firstName) : undefined,
      lastName: dto.lastName ? new StringValue(dto.lastName) : undefined,
      secondLastName: dto.secondLastName ? new StringValue(dto.secondLastName) : undefined,
      email: dto.email ? new Email(dto.email) : undefined,
      emailVerified: dto.emailVerified ? new DateTimeValue(dto.emailVerified) : undefined,
      phoneNumber: dto.phoneNumber ? new PhoneNumber(dto.phoneNumber) : undefined,
      picture: dto.picture ? new StringValue(dto.picture) : undefined,
      hashedPassword: dto.hashedPassword ? new StringValue(dto.hashedPassword) : undefined,
      leadId: dto.leadId ? new UUID(dto.leadId) : undefined,
      locationId: dto.locationId ? new UUID(dto.locationId) : undefined,
      rfc: dto.rfc ? new StringValue(dto.rfc) : undefined,
      curp: dto.curp ? new StringValue(dto.curp) : undefined,
      gender: dto.gender ? new StringValue(dto.gender) : undefined,
      driverLicenseNumber: dto.driverLicenseNumber ? new StringValue(dto.driverLicenseNumber) : undefined,
      driverLicenseValidity: dto.driverLicenseValidity ? new DateTimeValue(dto.driverLicenseValidity): undefined,
      driverLicensePermanent: dto.driverLicensePermanent ? new BooleanValue(dto.driverLicensePermanent) : undefined,
      uberDriverId: dto.uberDriverId ? new StringValue(dto.uberDriverId) : undefined,
      uberRating: dto.uberRating ? new UberDriverRating(dto.uberRating) : undefined,
      uberPromoCode: dto.uberPromoCode ? new StringValue(dto.uberPromoCode) : undefined,
      uberActivationStatus: dto.uberActivationStatus ? new StringValue(dto.uberActivationStatus) : undefined,
      uberPartnerRole: dto.uberPartnerRole ? new StringValue(dto.uberPartnerRole) : undefined,
      uberEarningsRetentionActive: dto.uberEarningsRetentionActive
        ? new BooleanValue(dto.uberEarningsRetentionActive)
        : new BooleanValue(false),
      uberTier: dto.uberTier ? new StringValue(dto.uberTier) : undefined,
      uberTenureMonths: dto.uberTenureMonths ? new NumberValue(dto.uberTenureMonths) : undefined,
      uberLastMonthTripCount: dto.uberLastMonthTripCount ? new NumberValue(dto.uberLastMonthTripCount) : undefined,
      uberLastMonthEarnings: dto.uberLastMonthEarnings ? new NumberValue(dto.uberLastMonthEarnings) : undefined,
      name: dto.name ? new StringValue(dto.name) : undefined, // needed for nextAuth fixed props
      image: dto.image ? new StringValue(dto.image) : undefined, // needed for nextAuth fixed props
      createdAt: dto.createdAt ? new DateTimeValue(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new DateTimeValue(dto.updatedAt) : undefined,
      uberCityName: dto.uberCityName ? new StringValue(dto.uberCityName) : undefined,
      uberCityCode: dto.uberCityCode ? new StringValue(dto.uberCityCode) : undefined,
      dob: dto.dob ? new DateTimeValue(dto.dob) : undefined,

      quotes: dto.quotes ? dto.quotes.map((q) => QuoteFactory.fromDTO(q)) : [],
      groups: dto.groups ? dto.groups.map((g) => UserGroupFactory.fromDTO(g)) : [],
      applications: dto.applications ? dto.applications.map((a) => ApplicationFactory.fromDTO(a)) : [],
      assignedTasks: dto.assignedTasks ? dto.assignedTasks.map((t) => TaskFactory.fromDTO(t)) : [],
      leasings: dto.leasings ? dto.leasings.map((l) => LeasingFactory.fromDTO(l)) : [],
      accounts: dto.accounts ? dto.accounts.map((l) => AccountFactory.fromDTO(l)) : [],
    })
  }

  static create(args: UserArgs): UserEntity {
    return new UserEntity({
      ...args,
      quotes: [],
      assignedTasks: [],
      groups: [],
      applications: [],
      leasings: [],
      accounts: [],
      id: new UserId(),
      createdAt: new DateTimeValue(new Date()),
    })
  }
}
