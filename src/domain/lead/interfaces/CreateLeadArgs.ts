import { Email } from '@domain/shared/Email'
import { PhoneNumber } from '@domain/shared/PhoneNumber'
import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'

export interface CreateLeadArgs {
  email?: Email
  phoneNumber?: PhoneNumber
  firstName?: StringValue
  lastName?: StringValue
  contactype?: StringValue
  supportUserId?: UUID
  visitAppointmentAt?: StringValue
}
