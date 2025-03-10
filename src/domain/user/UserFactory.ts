import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { UserEntity, UserEntityProps } from './models/UserEntity'
import { DateTimeValue } from '../shared/DateTime'
import { StringValue } from '@domain/shared/StringValue'
import { UserGroupFactory } from './UserGroupFactory'
import { UserId } from './models/UserId'
import { PhoneNumber } from '@domain/shared/PhoneNumber'
import { Email } from '@domain/shared/Email'
import { AccountFactory } from './AccountFactory'

export type UserArgs = Merge<
  Omit<UserEntityProps, 'quotes' | 'assignedTasks' | 'groups' | 'applications' | 'leasings' | 'accounts'>,
  {
    id?: UUID
    createdAt?: DateTimeValue
  }
>

export class UserFactory {
  static fromDTO(dto: DTO<UserEntity>): UserEntity {
    return new UserEntity({
      id: new UserId(dto.id),
      firstName: dto.firstName ? new StringValue(dto.firstName) : undefined,
      lastName: dto.lastName ? new StringValue(dto.lastName) : undefined,
      email: dto.email ? new Email(dto.email) : undefined,
      emailVerified: dto.emailVerified ? new DateTimeValue(dto.emailVerified) : undefined,
      phoneNumber: dto.phoneNumber ? new PhoneNumber(dto.phoneNumber) : undefined,
      picture: dto.picture ? new StringValue(dto.picture) : undefined,
      hashedPassword: dto.hashedPassword ? new StringValue(dto.hashedPassword) : undefined,
      createdAt: dto.createdAt ? new DateTimeValue(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new DateTimeValue(dto.updatedAt) : undefined,
      
      groups: dto.groups ? dto.groups.map((g) => UserGroupFactory.fromDTO(g)) : [],
      accounts: dto.accounts ? dto.accounts.map((l) => AccountFactory.fromDTO(l)) : [],
    })
  }

  static create(args: UserArgs): UserEntity {
    return new UserEntity({
      ...args,
      groups: [],
      accounts: [],
      id: new UserId(),
      createdAt: new DateTimeValue(new Date()),
    })
  }
}
