import { AuthAccessToken, AuthToken } from '@/application/service/AuthService'
import { ApiHeaders } from '@api/shared/Api'
import { UnauthorizedError, UnexpectedError, ValidationError } from '@domain/error'
import type UserRepository from '@domain/user/UserRepository'
import { UserEntity } from '@domain/user/models/UserEntity'
import { UserId } from '@domain/user/models/UserId'
import { DI } from '@infrastructure/inversify.symbols'
import { inject, injectable } from 'inversify'
import jwt from 'jsonwebtoken'
import { randomBytes, scryptSync } from 'crypto'
import { AuthCredentialsArgs, ExternalAuthService } from '@/application/service/ExternalAuthService'
import { AuthProvider } from '@domain/shared/AuthProvider'
import authWithDatabase from './AuthWithDatabase'
import authWithSmartIT from './AuthWithSmartIT'
import { StringValue } from '@domain/shared/StringValue'
import impersonateUser from './ImpersonateUser'
import { LoggingModule, type LoggingService } from '@/application/service/LoggingService'

@injectable()
export class ExternalApiAuthJWT implements ExternalAuthService {
  // TODO need repo here? move this to other place
  @inject(DI.UserRepository) private readonly _userRepository!: UserRepository
  @inject(DI.LoggingService) private _logger!: LoggingService

  async getToken(headers: ApiHeaders): Promise<AuthToken> {
    console.log('1212121 EXTERNAL ExternalApiAuthJWT getToken AAAAAA')

    const encodedToken = this._tokenFromAuthorization(headers) ?? this._tokenFromCookie(headers)
    if (!encodedToken) {
      throw new UnauthorizedError('Access token not found')
    }
    console.log('1212121 EXTERNAL ExternalApiAuthJWT getToken BBBBB', encodedToken)

    let decodedToken = null
    try {
      const publicKey = (process.env.EXTERNAL_API_JWT_PUBLIC_KEY as string).replace(/\\n/g, '\n')
      decodedToken = jwt.verify(encodedToken, publicKey, {
        algorithms: ['RS256'],
      })
      console.log('1212121 EXTERNAL ExternalApiAuthJWT getToken CCCCCC', decodedToken)

      if (!decodedToken) {
        throw new UnauthorizedError('Access Token invalid')
      }

      return decodedToken as AuthToken
    } catch (error) {
      this._logger.log(LoggingModule.AUTH, 'NextAuthService verifyToken DECODE ERROR', error)
      console.error('ExternalApiAuthJWT error', error)
      throw new UnauthorizedError('Access token format invalid')
    }
  }

  getUserId(token: AuthToken): UserId {
    const userId = new UserId(token.sub)
    if (!userId) {
      throw new UnauthorizedError('User Id not found')
    }

    return userId
  }

  async getUser(headers: ApiHeaders): Promise<UserEntity> {
    const accessToken = await this.getToken(headers)

    const user = await this._userRepository.getById(new UserId(accessToken.sub))
    if (!user) {
      throw new UnauthorizedError('User not found')
    }

    return user
  }

  private _tokenFromAuthorization(headers: ApiHeaders): string | undefined {
    return headers.authorization?.replace('Bearer ', '')
  }

  private _tokenFromCookie(headers: ApiHeaders): string | undefined {
    const cookies = headers.cookie
    if (!cookies) {
      return undefined
    }

    return this._getCookieProp(cookies, 'next-auth.session-token')
  }

  private _getCookieProp(cookies: string, prop: string): string | undefined {
    const cookieSegments = cookies.split('; ')

    const filteredCookie = cookieSegments.find((c) => c.startsWith(`${prop}=`))

    if (filteredCookie) {
      return filteredCookie.replace(`${prop}=`, '')
    }

    return undefined
  }

  // Pass the password string and get hashed password back
  // ( and store only the hashed string in your database)
  private encryptPassword = (password: StringValue, salt: StringValue) => {
    return scryptSync(password.toDTO(), salt.toDTO(), 32).toString('hex')
  }

  /**
   * Hash password with random salt
   * @return {string} password hash followed by salt
   *  XXXX till 64 XXXX till 32
   *
   */
  hashPassword = (password: StringValue): StringValue => {
    // Any random string here (ideally should be at least 16 bytes)
    const salt = randomBytes(16).toString('hex')
    return new StringValue(this.encryptPassword(password, new StringValue(salt)) + salt)
  }

  // fetch the user from your db and then use this function

  /**
   * Match password against the stored hash
   */
  matchPassword = (password: StringValue, hash: StringValue): Boolean => {
    // extract salt from the hashed string
    // our hex password length is 32*2 = 64
    const salt = hash.toDTO().slice(64)
    const originalPassHash = hash.toDTO().slice(0, 64)
    const currentPassHash = this.encryptPassword(password, new StringValue(salt))
    return originalPassHash === currentPassHash
  }

  authWithCredentials(provider: AuthProvider, credentials: AuthCredentialsArgs): Promise<AuthAccessToken> {
    if (provider.sameValueAs(AuthProvider.SMARTIT)) {
      if (!credentials.password) {
        throw new ValidationError('Password is required for this type of auth')
      }

      return authWithSmartIT(credentials.email, credentials.password)
    }

    if (provider.sameValueAs(AuthProvider.DATABASE)) {
      if (!credentials.password) {
        throw new ValidationError('Password is required for this type of auth')
      }

      return authWithDatabase(credentials.email, credentials.password)
    }

    if (provider.sameValueAs(AuthProvider.IMPERSONATE)) {
      return impersonateUser(credentials.email, credentials.password)
    }

    throw new UnexpectedError('Provider not found or implemented')
  }
}
