import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import { UserEntity } from '@domain/user/models/UserEntity'
import type UserRepository from '@domain/user/UserRepository'
import AbstractUserService from '@domain/user/UserService'
import { Email } from '@domain/shared/Email'
import { UserId } from '@domain/user/models/UserId'
import { CreateUserArgs } from '@domain/user/interfaces/CreateUserArgs'
import { UserFactory } from '@domain/user/UserFactory'
import { StringValue } from '@domain/shared/StringValue'
import { AuthAccessToken, type AuthService, AuthToken } from '@/application/service/AuthService'
import { UnexpectedError } from '@domain/error'
import jwt from 'jsonwebtoken'
import { AuthProvider } from '@domain/shared/AuthProvider'
import { type ExternalAuthService } from '@/application/service/ExternalAuthService'
import { GroupId } from '@domain/user/models/GroupId'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { UpdateUserPersonalInfoArgs } from '@domain/user/interfaces/UpdateUserPersonalInfoArgs'

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

  async authWithCredentials(email: Email, password?: StringValue, provider?: AuthProvider): Promise<AuthAccessToken> {
    const useProvider = provider ?? AuthProvider.DATABASE

    const credentials = {
      email,
      password,
    }

    return this._externalAuthService.authWithCredentials(useProvider, credentials)
  }

  async create(props: CreateUserArgs): Promise<UserEntity> {
    const hashedPassword = this._authService.hashPassword(props.password)

    const prepareUser = UserFactory.create({
      email: props.email,
      firstName: props.firstName,
      lastName: props.lastName,
      hashedPassword,
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

    return this._userRepository.updatePersonalInfo(
      props.userId, 
      props.firstName,
      props.lastName,
    )
  }

}
