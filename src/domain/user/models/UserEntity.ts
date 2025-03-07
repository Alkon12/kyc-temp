import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'
import { BooleanValue } from '../../shared/BooleanValue'
import { DateTimeValue } from '../../shared/DateTime'
import { UberDriverRating } from '@domain/shared/UberDriverRating'
import { UserGroupEntity } from './UserGroupEntity'
import { TaskEntity } from '@domain/task/TaskEntity'
import { QuoteEntity } from '@domain/quote/QuoteEntity'
import { UserId } from './UserId'
import { ApplicationEntity } from '@domain/application/ApplicationEntity'
import { PhoneNumber } from '@domain/shared/PhoneNumber'
import { Email } from '@domain/shared/Email'
import { LeasingEntity } from '@domain/leasing/LeasingEntity'
import { AccountEntity } from './AccountEntity'
import { NumberValue } from '@domain/shared/NumberValue'

export type UserEntityProps = {
  id: UserId
  firstName?: StringValue
  lastName?: StringValue
  secondLastName?: StringValue
  email?: Email
  emailVerified?: DateTimeValue
  phoneNumber?: PhoneNumber
  picture?: StringValue
  rfc?: StringValue
  curp?: StringValue
  gender?: StringValue
  driverLicenseNumber?: StringValue
  driverLicenseValidity?: DateTimeValue
  driverLicensePermanent?: BooleanValue

  hashedPassword?: StringValue
  leadId?: UUID
  locationId?: UUID

  uberDriverId?: StringValue
  uberRating?: UberDriverRating
  uberPromoCode?: StringValue
  uberActivationStatus?: StringValue
  uberPartnerRole?: StringValue
  uberEarningsRetentionActive?: BooleanValue
  uberCityName?: StringValue
  uberCityCode?: StringValue
  uberTier?: StringValue
  uberTenureMonths?: NumberValue
  uberLastMonthTripCount?: NumberValue
  uberLastMonthEarnings?: NumberValue
  dob?: DateTimeValue
  idSmartIt?: StringValue
  // uberAutoDisbursementsElgibileProducts
  // needed for nextAuth fixed props
  name?: StringValue
  image?: StringValue

  createdAt?: DateTimeValue
  updatedAt?: DateTimeValue

  applications: ApplicationEntity[]
  quotes: QuoteEntity[]
  groups: UserGroupEntity[]
  assignedTasks: TaskEntity[]
  leasings: LeasingEntity[]
  accounts: AccountEntity[]
}

export class UserEntity extends AggregateRoot<'UserEntity', UserEntityProps> {
  get props(): UserEntityProps {
    return this._props
  }

  getHashedPassword() {
    return this._props.hashedPassword
  }

  getId() {
    return this._props.id
  }

  getEmail() {
    return this._props.email
  }

  getPhoneNumber() {
    return this._props.phoneNumber
  }

  getName(): StringValue {
    return this._props.name ?? new StringValue(`${this._props.firstName?.toDTO()} ${this._props.lastName?.toDTO()}`)
  }

  getFirstName() {
    return this._props.firstName
  }

  getLastName() {
    return this._props.lastName
  }

  getDateOfBirth() {
    return this._props.dob
  }

  getFullname() {
    return this.getName()
  }

  getGroups() {
    return this._props.groups
  }

  getPicture() {
    return this._props.picture
  }
  getIdSmartIt() {
    return this._props.idSmartIt
  }
  getAccounts() {
    return this._props.accounts
  }

  getApplications() {
    return this._props.applications
  }

  getDriverId() {
    return this._props.uberDriverId
  }

  setUberCity(name: string, code: string) {
    this._props.uberCityName = new StringValue(name)
    this._props.uberCityCode = new StringValue(code)
  }

  setDob(value: string) {
    this._props.dob = new DateTimeValue(value)
  }

  setUberTier(value: string) {
    this._props.uberTier = new StringValue(value)
  }
  setUberLastMonthTripCount(value: number) {
    this._props.uberLastMonthTripCount = new NumberValue(value)
  }
  setUberLastMonthEarnings(value: number) {
    this._props.uberLastMonthEarnings = new NumberValue(value)
  }
  setUberTenureMonths(value: number) {
    this._props.uberTenureMonths = new NumberValue(value)
  }
}
