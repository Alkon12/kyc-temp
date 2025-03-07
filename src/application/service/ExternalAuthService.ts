import { ApiHeaders } from '@api/shared/Api'
import { UserEntity } from '@domain/user/models/UserEntity'
import { AuthToken } from './AuthService'
import { AuthAccessToken } from '@/application/service/AuthService'
import { AuthProvider } from '@domain/shared/AuthProvider'
import { Email } from '@domain/shared/Email'
import { StringValue } from '@domain/shared/StringValue'
import { UserId } from '@domain/user/models/UserId'

// TODO abstract to different type of providers
export interface AuthCredentialsArgs {
  email: Email
  password?: StringValue
}

export interface ExternalAuthService {
  getToken(headers: ApiHeaders): Promise<AuthToken>
  getUserId(headers: AuthToken): UserId
  getUser(headers: ApiHeaders): Promise<UserEntity>
  hashPassword(password: StringValue): StringValue
  matchPassword(password: StringValue, hash: StringValue): Boolean
  authWithCredentials(provider: AuthProvider, credentials: AuthCredentialsArgs): Promise<AuthAccessToken>
}
