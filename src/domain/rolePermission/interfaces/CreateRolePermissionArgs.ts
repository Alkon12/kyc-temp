import { RoleId } from '@domain/role/models/RoleId'
import { PermissionId } from '@domain/permission/models/PermissionId'

export interface CreateRolePermissionArgs {
  roleId: RoleId
  permissionId: PermissionId
}