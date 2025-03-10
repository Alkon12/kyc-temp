import { StringValue } from '@domain/shared/StringValue'
import { UserId } from '../models/UserId'

export interface UpdateUserPersonalInfoArgs {
  userId: UserId
  firstName: StringValue
  lastName: StringValue
}
