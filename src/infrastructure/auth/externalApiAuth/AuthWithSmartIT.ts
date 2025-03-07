import { StringValue } from '@domain/shared/StringValue'
import { AuthAccessToken } from '@/application/service/AuthService'
import { generateAuthAccessToken } from './GenerateAuthAccessToken'
import { DI } from '@infrastructure/inversify.symbols'
import container from '@infrastructure/inversify.config'
import UserRepository from '@domain/user/UserRepository'
import { UserService } from '@service/UserService'
import { Email } from '@domain/shared/Email'
import { GroupId } from '@domain/user/models/GroupId'
import authWithDatabase from './AuthWithDatabase'

const authWithSmartIT = async (email: Email, password: StringValue): Promise<AuthAccessToken> => {
  try {
    const userRepository = container.get<UserRepository>(DI.UserRepository)
    const userService = container.get<UserService>(DI.UserService)
    const smartitUser = email.toDTO().split('@')[0]
    // POST SMART IT LOGIN SERVICE
    console.log('authWithSmartIT SMARTIT ENDPOINT: ', process.env.NEXT_PUBLIC_URL_SMARTIT + 'usuarios/login')

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_SMARTIT}usuarios/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: smartitUser,
        password: password.toDTO(),
        secret: process.env.SMARTIT_API_SECRET_KEY,
      }),
    })

    console.log('SMART IT RESPONSE', response)

    if (response.status === 500) {
      throw new Error('Auth Service Unavailable!')
    }

    if (response.status === 204) {
      console.log('EMAIL DB', email)
      return authWithDatabase(new Email(smartitUser), password)
    }

    const userSmart = await response.json()

    if (response.status === 401) {
      console.log('[USUARIO RESPONSE]', userSmart.user)
      if (userSmart.user !== undefined) {
        throw new Error('Your account has been blocked!')
      } else {
        throw new Error('Invalid password!')
      }
    }

    let userRent = await userRepository.getByName(new StringValue(userSmart.username))
    console.log('[Service USER - AUTOFINRENT]', userRent)
    if (!userRent) {
      const props = {
        email: new Email(`${userSmart.id}@grupoautofin.com`),
        firstName: new StringValue(userSmart.nombre),
        lastName: new StringValue(`${userSmart.apellidoPaterno} ${userSmart.apellidoMaterno}`),
        password: new StringValue(''),
        assignedGroups: [GroupId.BACKOFFICE],
        name: userSmart.username,
      }

      const newUserRent = await userService.create(props)
      if (!newUserRent) {
        throw new Error('Unable to create user!')
      }

      userRent = newUserRent
    }

    userRent.props.email = new Email(userSmart.mail)
    userRent.props.idSmartIt = userSmart.token

    return generateAuthAccessToken(userRent)
  } catch (error) {
    console.error('Unexpected error', error)
    throw new Error('Unexpected error')
  }
}

export default authWithSmartIT
