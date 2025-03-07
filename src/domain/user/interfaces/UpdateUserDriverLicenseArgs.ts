import { StringValue } from '@domain/shared/StringValue'
import { UserId } from '../models/UserId'
import { DateTimeValue } from '@domain/shared/DateTime'
import { BooleanValue } from '@domain/shared/BooleanValue'

export interface UpdateUserDriverLicenseArgs {
  userId: UserId
  driverLicenseNumber: StringValue
  driverLicenseValidity?: DateTimeValue
  driverLicensePermanent: BooleanValue
}
