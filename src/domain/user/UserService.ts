import { DTO } from '@domain/kernel/DTO'
import { StringValue } from '@domain/shared/StringValue'
import { UserEntity } from '@domain/user/models/UserEntity'
import { UserId } from './models/UserId'
import { CreateUserArgs } from './interfaces/CreateUserArgs'
import { UpdateUserPersonalInfoArgs } from './interfaces/UpdateUserPersonalInfoArgs'
import { AuthAccessToken } from '@/application/service/AuthService'
import { AuthProvider } from '@domain/shared/AuthProvider'
import { Email } from '@domain/shared/Email'
import { GroupId } from './models/GroupId'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { UpdateUserDriverLicenseArgs } from './interfaces/UpdateUserDriverLicenseArgs'

export interface AuthServiceResponse {
  accessToken: AuthAccessToken
  user: UserEntity
}

export default abstract class AbstractUserService {
  abstract getById(userId: UserId): Promise<UserEntity>
  abstract getByGroup(groupId: GroupId): Promise<UserEntity[]>
  abstract getAll(): Promise<UserEntity[]>
  abstract getSystemUser(): Promise<UserEntity>
  abstract getByName(name: StringValue): Promise<UserEntity | null>
  abstract authWithCredentials(email: Email, password?: StringValue, provider?: AuthProvider): Promise<AuthAccessToken>
  abstract authWithUberDriver(token: StringValue): Promise<AuthServiceResponse>
  abstract create(props: CreateUserArgs): Promise<UserEntity>
  abstract updatePersonalInfo(props: UpdateUserPersonalInfoArgs): Promise<BooleanValue>
  abstract updateDriverLicenseInfo(props: UpdateUserDriverLicenseArgs): Promise<BooleanValue>
}
