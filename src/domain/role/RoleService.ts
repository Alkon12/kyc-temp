import { RoleEntity } from '@domain/role/models/RoleEntity'
import { RoleId } from './models/RoleId'
import { CreateRoleArgs } from './interfaces/CreateRoleArgs'

export default abstract class AbstractRoleService {
  abstract getById(roleId: RoleId): Promise<RoleEntity>
  abstract getByName(roleName: string): Promise<RoleEntity>
  abstract getAll(): Promise<RoleEntity[]>
  abstract create(props: CreateRoleArgs): Promise<RoleEntity>
  abstract update(roleId: RoleId, props: Partial<CreateRoleArgs>): Promise<RoleEntity>
}