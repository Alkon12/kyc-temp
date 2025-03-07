import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'
import { BooleanValue } from '../shared/BooleanValue'
import { DateTimeValue } from '../shared/DateTime'
import { LocationEntity } from '@domain/location/LocationEntity'
import { Email } from '@domain/shared/Email'
import { LeadStatus } from './LeadStatus'
import { PhoneNumber } from '@domain/shared/PhoneNumber'
import { UberDriverRating } from '@domain/shared/UberDriverRating'
import { UserEntity } from '@domain/user/models/UserEntity'

export type LeadEntityProps = {
  id: UUID
  friendlyId?: StringValue
  firstName?: StringValue
  lastName?: StringValue
  email?: Email
  contactype?: StringValue
  phoneNumber?: PhoneNumber
  hasUberAccount?: BooleanValue
  uberDriverId?: StringValue
  uberRating?: UberDriverRating
  createdAt?: DateTimeValue
  updatedAt?: DateTimeValue
  locationId?: StringValue
  productOfInterestId?: StringValue

  isBot?: BooleanValue
  browserName?: StringValue
  browserVersion?: StringValue
  deviceModel?: StringValue
  deviceType?: StringValue
  deviceVendor?: StringValue
  engineName?: StringValue
  engineVersion?: StringValue
  supportUserId?: UUID
  visitAppointmentAt?: DateTimeValue

  countryCode?: StringValue

  location?: LocationEntity
  supportUser?: UserEntity

  status: LeadStatus
}

export class LeadEntity extends AggregateRoot<'LeadEntity', LeadEntityProps> {
  get props(): LeadEntityProps {
    return this._props
  }

  getId() {
    return this._props.id
  }

  getFriendlyId() {
    return this._props.friendlyId
  }

  itsABot(): boolean {
    return !!this._props.isBot?.toDTO()
  }

  hasUberAccount(): boolean {
    return !!this._props.hasUberAccount?.toDTO()
  }

  wasDismissed(): boolean {
    return this._props.status.sameValueAs(LeadStatus.DISMISSED)
  }

  isArrived(): boolean {
    return this._props.status.sameValueAs(LeadStatus.ARRIVED)
  }

  isBeingManaged(): boolean {
    return this._props.status.sameValueAs(LeadStatus.CONTACTED)
  }

  wasConverted(): boolean {
    return this._props.status.sameValueAs(LeadStatus.CONVERTED)
  }

  getEmail() {
    return this._props.email
  }

  getPhoneNumber() {
    return this._props.phoneNumber
  }

  setHasUberAccount(hasUberAccount: boolean) {
    this._props.hasUberAccount = new BooleanValue(hasUberAccount)
  }
}
