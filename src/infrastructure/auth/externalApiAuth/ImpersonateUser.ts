import { Email } from '@domain/shared/Email'
import { AuthAccessToken } from '@/application/service/AuthService'
import { ForbiddenError } from '@domain/error'
import { generateAuthAccessToken } from './GenerateAuthAccessToken'
import type UserRepository from '@domain/user/UserRepository'
import { DI } from '@infrastructure/inversify.symbols'
import container from '@infrastructure/inversify.config'
import { StringValue } from '@domain/shared/StringValue'

const impersonateUser = async (email: Email, masterKey?: StringValue): Promise<AuthAccessToken> => {
  const userRepository = container.get<UserRepository>(DI.UserRepository)

  const definedMasterKey = new StringValue(process.env.IMPERSONATE_MASTER_KEY || '')
  if (!masterKey || !definedMasterKey.sameValueAs(masterKey)) {
    throw new ForbiddenError(`The master key provided is invalid`)
  }

  const user = await userRepository.findByEmail(email)
  if (!user) {
    throw new ForbiddenError(`User not found with Email ${email.toDTO()}`)
  }

  return generateAuthAccessToken(user)
}

export default impersonateUser
