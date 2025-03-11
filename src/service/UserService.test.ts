import 'reflect-metadata'
import { Container } from 'inversify'
import { UserService } from './UserService'
import { AuthService } from '@/application/service/AuthService'
import { ExternalAuthService } from '@/application/service/ExternalAuthService'
import { UserId } from '@domain/user/models/UserId'
import { UnexpectedError } from '@domain/error'
import { Email } from '@domain/shared/Email'
import { StringValue } from '@domain/shared/StringValue'
import { AuthProvider } from '@domain/shared/AuthProvider'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { UpdateUserPersonalInfoArgs } from '@domain/user/interfaces/UpdateUserPersonalInfoArgs'
import { mock, MockProxy } from 'jest-mock-extended'
import { DI } from '@infrastructure'
import UserRepository from '@domain/user/UserRepository'


describe('UserService', () => {
  let container: Container
  let userService: UserService
  let userRepository: MockProxy<UserRepository>
  let authService: MockProxy<AuthService>
  let externalAuthService: MockProxy<ExternalAuthService>

  beforeEach(() => {
    container = new Container()
    userRepository = mock<UserRepository>()
    authService = mock<AuthService>()
    externalAuthService = mock<ExternalAuthService>()

    container.bind<UserRepository>(DI.UserRepository).toConstantValue(userRepository)
    container.bind<AuthService>(DI.AuthService).toConstantValue(authService)
    container.bind<ExternalAuthService>(DI.ExternalAuthService).toConstantValue(externalAuthService)
    container.bind<UserService>(UserService).toSelf()

    userService = container.get<UserService>(UserService)
  })

//   it('should throw error if system user not found', async () => {
//     userRepository.getById.mockResolvedValue(null)

//     await expect(userService.getSystemUser()).rejects.toThrow(UnexpectedError)
//   })

  it('should authenticate with credentials', async () => {
    const email = new Email('user@example.com')
    const password = new StringValue('password')
    const provider = AuthProvider.DATABASE
    const token = 'auth-token'
    externalAuthService.authWithCredentials.mockResolvedValue(token)

    const result = await userService.authWithCredentials(email, password, provider)

    expect(result).toBe(token)
    expect(externalAuthService.authWithCredentials).toHaveBeenCalledWith(provider, { email, password })
  })

  it('should update personal info', async () => {
    const updateUserPersonalInfoArgs: UpdateUserPersonalInfoArgs = {
      userId: new UserId('user-id'),
      firstName: new StringValue('First'),
      lastName: new StringValue('Last'),
    }
    const resultValue = new BooleanValue(true)
    userRepository.updatePersonalInfo.mockResolvedValue(resultValue)

    const result = await userService.updatePersonalInfo(updateUserPersonalInfoArgs)

    expect(result).toBe(resultValue)
    expect(userRepository.updatePersonalInfo).toHaveBeenCalledWith(
      updateUserPersonalInfoArgs.userId,
      updateUserPersonalInfoArgs.firstName,
      updateUserPersonalInfoArgs.lastName,
    )
  })
})