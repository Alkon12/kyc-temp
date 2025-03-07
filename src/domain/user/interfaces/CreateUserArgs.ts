import { Email } from '@domain/shared/Email'
import { StringValue } from '@domain/shared/StringValue'
import { GroupId } from '../models/GroupId'

export interface CreateUserArgs {
  email: Email
  firstName: StringValue
  lastName: StringValue
  password: StringValue
  assignedGroups: GroupId[]
  name?: StringValue
}
