import { AuthToken } from '@/application/service/AuthService'
import { DTO } from '@domain/kernel/DTO'
import { UserEntity } from '@domain/user/models/UserEntity'
import { UserId } from '@domain/user/models/UserId'

export type ApiHeaders = Dict<string>

export interface ApiContext {
  headers: ApiHeaders
  token: AuthToken
  userId: UserId
  user?: Partial<DTO<UserEntity>>
}

export interface ApiPublicContext {
  headers: ApiHeaders
}

export interface ApiExternalContext {
  headers: ApiHeaders
  token: AuthToken
  userId: UserId
  user?: Partial<DTO<UserEntity>>
}
