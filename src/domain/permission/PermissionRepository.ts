import { PermissionEntity } from '@domain/permission/models/PermissionEntity'
import { PermissionId } from './models/PermissionId'

export default interface PermissionRepository {
  getById(permissionId: PermissionId): Promise<PermissionEntity>
  getByName(permissionName: string): Promise<PermissionEntity>
  getAll(): Promise<PermissionEntity[]>
  create(permission: PermissionEntity): Promise<PermissionEntity>
  save(permission: PermissionEntity): Promise<PermissionEntity>
}