import { UserEntity } from '@domain/user/models/UserEntity'
import { AuthAccessToken, AuthToken } from '@/application/service/AuthService'
import jwt from 'jsonwebtoken'

export const generateAuthAccessToken = async (user: UserEntity): Promise<AuthAccessToken> => {
  const tokenIssued = Math.floor(Date.now() / 1000)
  const tokenExpire = tokenIssued + 60 * 60 * 24 * 7

  const token: AuthToken = {
    sub: user.getId().toDTO(),
    name: user.getFirstName()?.toDTO() ?? '',
    email: user.getEmail()?.toDTO(),
    exp: tokenExpire,
    iat: tokenIssued,
  }

  const jwtPrivateKey = (process.env.EXTERNAL_API_JWT_PRIVATE_KEY as string).replace(/\\n/g, '\n')
  const accessToken = jwt.sign(token, jwtPrivateKey, { algorithm: 'RS256' });

  return accessToken;
}
