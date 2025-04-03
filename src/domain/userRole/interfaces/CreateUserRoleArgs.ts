import { UserId } from '@domain/user/models/UserId'
import { RoleId } from '@domain/role/models/RoleId'
import { CompanyId } from '@domain/company/models/CompanyId'

export interface CreateUserRoleArgs {
  userId: UserId
  roleId: RoleId
  companyId?: CompanyId
}