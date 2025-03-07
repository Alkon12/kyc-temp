import { Email } from '@domain/shared/Email'
import { UserEntity } from '@domain/user/models/UserEntity'
import { UserId } from './models/UserId'
import { StringValue } from '@domain/shared/StringValue'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { AuthTokenRenewal } from '@/application/service/AuthService'
import { AccountType } from './models/AccountType'
import { AccountProvider } from './models/AccountProvider'
import { AccountEntity } from './models/AccountEntity'
import { GroupId } from './models/GroupId'
import { DateTimeValue } from '@domain/shared/DateTime'

export default interface UserRepository {
  findByEmail(email: Email): Promise<UserEntity | null>
  getById(userId: UserId): Promise<UserEntity>
  getByGroup(groupId: GroupId): Promise<UserEntity[]>
  getAll(): Promise<UserEntity[]>
  getByName(name: StringValue): Promise<UserEntity | null>
  create(user: UserEntity, assignedGroups: GroupId[]): Promise<UserEntity>
  updateAccountTokens(
    userId: UserId,
    type: AccountType,
    provider: AccountProvider,
    props: AuthTokenRenewal,
  ): Promise<BooleanValue>
  updatePersonalInfo(
    userId: UserId,
    rfc: StringValue,
    curp: StringValue,
    firstName: StringValue,
    lastName: StringValue,
    secondLastName?: StringValue
  ): Promise<BooleanValue>
  updateDriverLicenseInfo(
    userId: UserId,
    driverLicenseNumber: StringValue,
    driverLicensePermanent: BooleanValue,
    driverLicenseValidity?: DateTimeValue,
  ): Promise<BooleanValue>
  getAccount(userId: UserId, type: AccountType, provider: AccountProvider): Promise<AccountEntity | null>
  save(quote: UserEntity): Promise<UserEntity>
}
