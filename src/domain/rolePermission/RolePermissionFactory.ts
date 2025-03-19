import { DTO } from '@domain/kernel/DTO'
import { RolePermissionEntity, RolePermissionEntityProps } from './models/RolePermissionEntity'
import { RoleId } from '@domain/role/models/RoleId'
import { PermissionId } from '@domain/permission/models/PermissionId'
import { RoleFactory } from '@domain/role/RoleFactory'
import { PermissionFactory } from '@domain/permission/PermissionFactory'

export type RolePermissionArgs = Omit<RolePermissionEntityProps, 'role' | 'permission'>

export class RolePermissionFactory {
  static fromDTO(dto: DTO<RolePermissionEntity>): RolePermissionEntity {
    return new RolePermissionEntity({
      roleId: new RoleId(dto.roleId),
      permissionId: new PermissionId(dto.permissionId),
      role: dto.role ? RoleFactory.fromDTO(dto.role) : undefined,
      permission: dto.permission ? PermissionFactory.fromDTO(dto.permission) : undefined,
    })
  }

  static create(args: RolePermissionArgs): RolePermissionEntity {
    return new RolePermissionEntity({
      ...args,
    })
  }
}