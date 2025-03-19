import { StringValue } from '@domain/shared/StringValue'

export interface CreateRoleArgs {
  roleName: StringValue
  description?: StringValue
}