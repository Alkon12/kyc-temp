import { Email } from '@domain/shared/Email'
import { StringValue } from '@domain/shared/StringValue'
import { AuthAccessToken, AuthService } from '@/application/service/AuthService'
import { ForbiddenError } from '@domain/error'
import { generateAuthAccessToken } from './GenerateAuthAccessToken'
import type UserRepository from '@domain/user/UserRepository'
import { DI } from '@infrastructure/inversify.symbols'
import container from '@infrastructure/inversify.config'

const authWithDatabase = async (email: Email, password: StringValue): Promise<AuthAccessToken> => {
  const userRepository = container.get<UserRepository>(DI.UserRepository)
  const authService = container.get<AuthService>(DI.AuthService)

  const user = await userRepository.findByEmail(email)
  if (!user) {
    throw new ForbiddenError(`User not found with Email ${email.toDTO()}`)
  }

  const hashedPassword = user.getHashedPassword()
  if (!hashedPassword) {
    throw new ForbiddenError(`User doesn't have password base auth ${email.toDTO()}`)
  }

  const passwordMatch = authService.matchPassword(password, hashedPassword)
  if (!passwordMatch) {
    throw new ForbiddenError(`Password doesn't match for user ${email.toDTO()}`)
  }

  return generateAuthAccessToken(user)
}

export default authWithDatabase
