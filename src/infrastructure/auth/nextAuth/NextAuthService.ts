import { AuthService, AuthToken, JWT } from '@/application/service/AuthService'
import { UnauthorizedError } from '@domain/error'
import type UserRepository from '@domain/user/UserRepository'
import { UserEntity } from '@domain/user/models/UserEntity'
import { UserId } from '@domain/user/models/UserId'
import { DI } from '@infrastructure/inversify.symbols'
import { inject, injectable } from 'inversify'
import { randomBytes, scryptSync } from 'crypto'
import { NextRequest } from 'next/server'
import { ApiHeaders } from '@api/shared/Api'
import jwt from 'jsonwebtoken'
import * as jose from 'jose'
import { LoggingModule, type LoggingService } from '@/application/service/LoggingService'
import { StringValue } from '@domain/shared/StringValue'

@injectable()
export class NextAuthService implements AuthService {
  @inject(DI.UserRepository) private readonly _userRepository!: UserRepository
  @inject(DI.LoggingService) private _logger!: LoggingService

  async getToken(request: NextRequest): Promise<AuthToken> {
    this._logger.log(LoggingModule.AUTH, 'NextAuthService getToken', request.headers)

    const authorization = request.headers.get
      ? request.headers.get('authorization')
      : (request.headers as unknown as ApiHeaders).authorization

    const cookie = request.headers.get
      ? request.headers.get('cookie')
      : (request.headers as unknown as ApiHeaders).cookie

    const encodedToken = this._tokenFromAuthorization(authorization) ?? this._tokenFromCookie(cookie)

    this._logger.log(LoggingModule.AUTH, 'NextAuthService getToken encoded token', encodedToken)

    if (!encodedToken) {
      throw new UnauthorizedError('Access token not found')
    }

    const publicKey = (process.env.EXTERNAL_API_JWT_PUBLIC_KEY as string).replace(/\\n/g, '\n')

    let decodedToken = null
    try {
      // decodedToken = await decode({
      //     token: encodedToken,
      //     secret: process.env.NEXTAUTH_SECRET as string,
      // });

      decodedToken = jwt.verify(encodedToken, publicKey, {
        algorithms: ['RS256'],
      })

      if (!decodedToken) {
        throw new UnauthorizedError('Access Token invalid')
      }

      this._logger.log(LoggingModule.AUTH, 'NextAuthService getToken decoded token', decodedToken)

      return decodedToken as AuthToken
    } catch (error) {
      this._logger.log(LoggingModule.AUTH, 'NextAuthService verifyToken DECODE ERROR', error)
      console.error('NextAuthService error', error)
      throw new UnauthorizedError('Access token format invalid')
    }
  }

  async getUserId(headers: NextRequest): Promise<UserId> {
    const token = await this.getToken(headers)
    const userId = new UserId(token.sub)
    if (!userId) {
      throw new UnauthorizedError('User Id not found')
    }

    return userId
  }

  async getUser(accessToken: AuthToken): Promise<UserEntity> {
    const user = await this._userRepository.getById(new UserId(accessToken.sub))
    if (!user) {
      throw new UnauthorizedError('User not found')
    }

    return user
  }

  private _tokenFromAuthorization(authorizationHeader: string | null): string | undefined {
    // console.log('44444 NextAuthService _tokenFromAuthorization', authorizationHeader)

    return authorizationHeader?.length ? authorizationHeader.replace('Bearer ', '') : undefined
  }

  private _tokenFromCookie(cookieHeader: string | null): string | undefined {
    this._logger.log(LoggingModule.AUTH, 'NextAuthService _tokenFromCookie cookieHeader', cookieHeader)

    if (!cookieHeader) {
      return undefined
    }

    let cookie = this._getCookieProp(cookieHeader, 'next-auth.session-token')
    if (!cookie) {
      cookie = this._getCookieProp(cookieHeader, '__Secure-next-auth.session-token')
    }

    return cookie
  }

  private _getCookieProp(cookies: string, prop: string): string | undefined {
    const cookieSegments = cookies.split('; ')

    this._logger.log(LoggingModule.AUTH, 'NextAuthService _getCookieProp cookieSegments', cookieSegments)

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

  signToken = async (decodedToken: JWT): Promise<StringValue> => {
    this._logger.log(LoggingModule.AUTH, 'NextAuthService signToken', decodedToken)

    const alg = 'RS256'
    const pkcs8 = (process.env.EXTERNAL_API_JWT_PRIVATE_KEY as string).replace(/\\n/g, '\n')
    const privateKey = await jose.importPKCS8(pkcs8, alg)

    const token = await new jose.SignJWT(decodedToken)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setIssuer('urn:example:issuer')
      .setAudience('urn:example:audience')
      .setExpirationTime('2h')
      .sign(privateKey)

    return new StringValue(token)
  }

  verifyToken = async (encodedToken: StringValue): Promise<JWT> => {
    this._logger.log(LoggingModule.AUTH, 'NextAuthService verifyToken', encodedToken)

    try {
      const alg = 'RS256'
      const spki = (process.env.EXTERNAL_API_JWT_PUBLIC_KEY as string).replace(/\\n/g, '\n')
      const publicKey = await jose.importSPKI(spki, alg)
      const { payload: decodedToken, protectedHeader } = await jose.jwtVerify(encodedToken.toDTO() ?? '', publicKey, {
        // issuer: 'urn:example:issuer',
        // audience: 'urn:example:audience',
      })

      this._logger.log(LoggingModule.AUTH, 'NextAuthService verifyToken decoded token', decodedToken)

      if (!decodedToken) {
        throw new UnauthorizedError('Access Token invalid')
      }

      return decodedToken as unknown as JWT
    } catch (error) {
      this._logger.log(LoggingModule.AUTH, 'NextAuthService verifyToken DECODE ERROR', error)
      console.error('NextAuthService error', error)
      throw new UnauthorizedError('Access token format invalid')
    }
  }
}
