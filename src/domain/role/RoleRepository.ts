import { RoleEntity } from '@domain/role/models/RoleEntity'
import { RoleId } from './models/RoleId'

export default interface RoleRepository {
  getById(roleId: RoleId): Promise<RoleEntity>
  getByName(roleName: string): Promise<RoleEntity>
  getAll(): Promise<RoleEntity[]>
  create(role: RoleEntity): Promise<RoleEntity>
  save(role: RoleEntity): Promise<RoleEntity>
}