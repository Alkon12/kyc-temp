import { RolePermissionEntity } from './models/RolePermissionEntity'
import { RoleId } from '@domain/role/models/RoleId'
import { PermissionId } from '@domain/permission/models/PermissionId'

export default interface RolePermissionRepository {
  getByRoleId(roleId: RoleId): Promise<RolePermissionEntity[]>
  getByPermissionId(permissionId: PermissionId): Promise<RolePermissionEntity[]>
  getByRoleAndPermission(roleId: RoleId, permissionId: PermissionId): Promise<RolePermissionEntity | null>
  create(rolePermission: RolePermissionEntity): Promise<RolePermissionEntity>
  delete(roleId: RoleId, permissionId: PermissionId): Promise<boolean>
}