import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { UserId } from '@domain/user/models/UserId'
import { RoleId } from '@domain/role/models/RoleId'
import { CompanyId } from '@domain/company/models/CompanyId'
import { UserEntity } from '@domain/user/models/UserEntity'
import { RoleEntity } from '@domain/role/models/RoleEntity'
import { CompanyEntity } from '@domain/company/models/CompanyEntity'

export type UserRoleEntityProps = {
  userId: UserId
  roleId: RoleId
  companyId?: CompanyId
  user?: UserEntity
  role?: RoleEntity
  company?: CompanyEntity
}

export class UserRoleEntity extends AggregateRoot<'UserRoleEntity', UserRoleEntityProps> {
  get props(): UserRoleEntityProps {
    return this._props
  }

  getUserId() {
    return this._props.userId
  }

  getRoleId() {
    return this._props.roleId
  }

  getCompanyId() {
    return this._props.companyId
  }

  getUser() {
    return this._props.user
  }

  getRole() {
    return this._props.role
  }

  getCompany() {
    return this._props.company
  }
}