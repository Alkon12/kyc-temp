import { StringValue } from '@domain/shared/StringValue'
import { UserEntity } from '../models/UserEntity'

export interface ClientApiAuthResponse {
  user: UserEntity
  accessToken: StringValue
}
