import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { RoleId } from '@domain/role/models/RoleId'
import { PermissionId } from '@domain/permission/models/PermissionId'
import { RoleEntity } from '@domain/role/models/RoleEntity'
import { PermissionEntity } from '@domain/permission/models/PermissionEntity'

export type RolePermissionEntityProps = {
  roleId: RoleId
  permissionId: PermissionId
  role?: RoleEntity
  permission?: PermissionEntity
}

export class RolePermissionEntity extends AggregateRoot<'RolePermissionEntity', RolePermissionEntityProps> {
  get props(): RolePermissionEntityProps {
    return this._props
  }

  getRoleId() {
    return this._props.roleId
  }

  getPermissionId() {
    return this._props.permissionId
  }

  getRole() {
    return this._props.role
  }

  getPermission() {
    return this._props.permission
  }
}