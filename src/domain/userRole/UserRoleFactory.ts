import { DTO } from '@domain/kernel/DTO'
import { UserRoleEntity, UserRoleEntityProps } from './models/UserRoleEntity'
import { UserId } from '@domain/user/models/UserId'
import { RoleId } from '@domain/role/models/RoleId'
import { CompanyId } from '@domain/company/models/CompanyId'
import { UserFactory } from '@domain/user/UserFactory'
import { RoleFactory } from '@domain/role/RoleFactory'
import { CompanyFactory } from '@domain/company/CompanyFactory'

export type UserRoleArgs = Omit<UserRoleEntityProps, 'user' | 'role' | 'company'>

export class UserRoleFactory {
  static fromDTO(dto: DTO<UserRoleEntity>): UserRoleEntity {
    return new UserRoleEntity({
      userId: new UserId(dto.userId),
      roleId: new RoleId(dto.roleId),
      companyId: dto.companyId ? new CompanyId(dto.companyId) : undefined,
      user: dto.user ? UserFactory.fromDTO(dto.user) : undefined,
      role: dto.role ? RoleFactory.fromDTO(dto.role) : undefined,
      company: dto.company ? CompanyFactory.fromDTO(dto.company) : undefined,
    })
  }

  static create(args: UserRoleArgs): UserRoleEntity {
    return new UserRoleEntity({
      ...args,
    })
  }
}