import { StringValue } from '@domain/shared/StringValue'
import { Email } from '@domain/shared/Email'

export interface UberDriverAuthTokenInput {
  sub: StringValue
  email: Email
}
