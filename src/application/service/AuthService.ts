import { DTO } from '@domain/kernel/DTO'
import { NumberValue } from '@domain/shared/NumberValue'
import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'
import { UserEntity } from '@domain/user/models/UserEntity'
import { UserId } from '@domain/user/models/UserId'
import { NextRequest } from 'next/server'

export type AuthToken = {
  sub?: string
  name?: string | null
  email?: string | null
  picture?: string | null

  iat?: number // date unix
  exp?: number // date unix
  jti?: string

  user?: DTO<UserEntity>
  groups?: string[]
  tokenSmartIt?: string;
}

export interface JWT extends Record<string, unknown> {}

export type AuthAccessToken = string

export type AuthTokenRenewal = {
  accessToken: StringValue
  accessTokenExpiresAt: NumberValue
  refreshToken: StringValue
}

export interface AuthService {
  getToken(headers: NextRequest): Promise<AuthToken> // TODO was a generic, but problems with NextRequest as object
  getUserId(headers: NextRequest): Promise<UserId>
  getUser(headers: AuthToken): Promise<UserEntity>
  hashPassword(password: StringValue): StringValue
  matchPassword(password: StringValue, hash: StringValue): Boolean
  signToken(decodedToken: JWT): Promise<StringValue>
  verifyToken(encodedToken: StringValue): Promise<JWT>
}
