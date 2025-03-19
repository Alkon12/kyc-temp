import { StringValue } from '@domain/shared/StringValue'

export interface CreatePermissionArgs {
  permissionName: StringValue
  description?: StringValue
}