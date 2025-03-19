import { UserRoleEntity } from './models/UserRoleEntity'
import { UserId } from '@domain/user/models/UserId'
import { RoleId } from '@domain/role/models/RoleId'
import { CompanyId } from '@domain/company/models/CompanyId'

export default interface UserRoleRepository {
  getByUserId(userId: UserId): Promise<UserRoleEntity[]>
  getByRoleId(roleId: RoleId): Promise<UserRoleEntity[]>
  getByCompanyId(companyId: CompanyId): Promise<UserRoleEntity[]>
  getByUserAndCompany(userId: UserId, companyId: CompanyId): Promise<UserRoleEntity[]>
  getByAll(userId: UserId, roleId: RoleId, companyId: CompanyId): Promise<UserRoleEntity | null>
  create(userRole: UserRoleEntity): Promise<UserRoleEntity>
  delete(userId: UserId, roleId: RoleId, companyId: CompanyId): Promise<boolean>
}