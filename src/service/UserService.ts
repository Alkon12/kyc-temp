import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import { UserEntity } from '@domain/user/models/UserEntity'
import type UserRepository from '@domain/user/UserRepository'
import AbstractUserService, { AuthServiceResponse } from '@domain/user/UserService'
import { Email } from '@domain/shared/Email'
import { UserId } from '@domain/user/models/UserId'
import { CreateUserArgs } from '@domain/user/interfaces/CreateUserArgs'
import { UserFactory } from '@domain/user/UserFactory'
import { StringValue } from '@domain/shared/StringValue'
import { AuthAccessToken, type AuthService, AuthToken } from '@/application/service/AuthService'
import { ForbiddenError, UnauthorizedError, UnexpectedError } from '@domain/error'
import jwt from 'jsonwebtoken'
import { UberDriverAuthTokenInput } from '@domain/user/interfaces/UberDriverAuthTokenInput'
import { AuthProvider } from '@domain/shared/AuthProvider'
import { type ExternalAuthService } from '@/application/service/ExternalAuthService'
import { GroupId } from '@domain/user/models/GroupId'
import { UpdateUserPersonalInfoArgs } from '@domain/user/interfaces/UpdateUserPersonalInfoArgs'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { UpdateUserDriverLicenseArgs } from '@domain/user/interfaces/UpdateUserDriverLicenseArgs'

@injectable()
export class UserService implements AbstractUserService {
  @inject(DI.UserRepository) private readonly _userRepository!: UserRepository
  @inject(DI.AuthService) private readonly _authService!: AuthService
  @inject(DI.ExternalAuthService)
  private readonly _externalAuthService!: ExternalAuthService

  async getSystemUser(): Promise<UserEntity> {
    const user = await this._userRepository.getById(new UserId(process.env.DEFAULT_SYSTEM_USER_ID))
    if (!user) {
      throw new UnexpectedError(`System user not found with default id ${process.env.DEFAULT_SYSTEM_USER_ID}`)
    }

    return user
  }

  async getById(userId: UserId): Promise<UserEntity> {
    return this._userRepository.getById(userId)
  }

  async getByGroup(groupId: GroupId): Promise<UserEntity[]> {
    return this._userRepository.getByGroup(groupId)
  }

  async getByName(name: StringValue): Promise<UserEntity | null> {
    // Bridge Smart IT
    const user = await this._userRepository.getByName(name)
    return user
  }

  async authWithCredentials(email: Email, password?: StringValue, provider?: AuthProvider): Promise<AuthAccessToken> {
    // defaulting SmartIT
    const useProvider = provider ? provider : AuthProvider.SMARTIT

    const credentials = {
      email,
      password,
    }

    return this._externalAuthService.authWithCredentials(useProvider, credentials)
  }

  async authWithUberDriver(token: StringValue): Promise<AuthServiceResponse> {
    const publicKey = (process.env.EXTERNAL_API_JWT_PUBLIC_KEY as string).replace(/\\n/g, '\n')
    const decodedToken = jwt.verify(token.toDTO(), publicKey, {
      algorithms: ['RS256'],
    })

    if (!decodedToken) {
      throw new UnauthorizedError('Access Token invalid')
    }

    const dataFromToken = decodedToken as unknown as DTO<UberDriverAuthTokenInput>

    const user = await this._userRepository.findByEmail(new Email(dataFromToken.email))
    if (!user) {
      throw new ForbiddenError(`User not found with Email ${dataFromToken.email}`)
    }

    const accessToken = await this._generateToken(user)

    return {
      accessToken,
      user,
    }
  }

  async create(props: CreateUserArgs): Promise<UserEntity> {
    const hashedPassword = this._authService.hashPassword(props.password)

    const prepareUser = UserFactory.create({
      email: props.email,
      firstName: props.firstName,
      lastName: props.lastName,
      hashedPassword,
      name: props.name ? props.name : undefined, // Bridge Smart IT TODO: Add unique User Prop
    })

    return this._userRepository.create(prepareUser, props.assignedGroups)
  }

  private async _generateToken(user: UserEntity): Promise<AuthAccessToken> {
    const tokenIssued = new Date().getTime() / 1000
    // const tokenExpire = (new Date().getTime() + 60 * 60 * 100 * 24 * 7) / 1000 // week from now

    const filteredUser: DTO<UserEntity> = {
      ...user.toDTO(),
      groups: [],
      hashedPassword: undefined,
    }

    const token: AuthToken = {
      sub: user.getId().toDTO(),
      name: user.getName().toDTO(),
      email: user.getEmail()?.toDTO(),
      picture: user.getPicture()?.toDTO(),
      iat: tokenIssued,
      // exp: tokenExpire,
      user: filteredUser,
      groups: user.getGroups().map((g) => g.getGroupId().toDTO()),
    }

    const jwtPrivateKey = (process.env.EXTERNAL_API_JWT_PRIVATE_KEY as string).replace(/\\n/g, '\n')
    const accessToken = jwt.sign(token, jwtPrivateKey, { algorithm: 'RS256' })

    return accessToken
  }

  async getAll(): Promise<UserEntity[]> {
    return this._userRepository.getAll()
  }

  async updatePersonalInfo(props: UpdateUserPersonalInfoArgs): Promise<BooleanValue> {

    //TODO: UPDATE SMARTIT PERSON

    return this._userRepository.updatePersonalInfo(
      props.userId, 
      props.rfc,
      props.curp,
      props.firstName,
      props.lastName,
      props.secondLastName
    )
  }

  async updateDriverLicenseInfo(props: UpdateUserDriverLicenseArgs): Promise<BooleanValue> {

    //TODO: UPDATE SMARTIT PERSON

    return this._userRepository.updateDriverLicenseInfo(
      props.userId, 
      props.driverLicenseNumber,
      props.driverLicensePermanent,
      props.driverLicenseValidity
    )
  }

}
