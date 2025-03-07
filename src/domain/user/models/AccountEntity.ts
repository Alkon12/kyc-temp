import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'
import { DateTimeValue } from '../../shared/DateTime'
import { UserId } from './UserId'
import { AccountType } from './AccountType'
import { AccountProvider } from './AccountProvider'
import { NumberValue } from '@domain/shared/NumberValue'

export type AccountEntityProps = {
  id: UUID
  userId: UserId
  type: AccountType
  provider: AccountProvider
  providerAccountId: StringValue
  refresh_token?: StringValue
  access_token?: StringValue
  expires_at?: NumberValue
  token_type?: StringValue
  scope?: StringValue
  id_token?: StringValue
  session_state?: StringValue
  createdAt?: DateTimeValue
  updatedAt?: DateTimeValue
}

export class AccountEntity extends AggregateRoot<'AccountEntity', AccountEntityProps> {
  get props(): AccountEntityProps {
    return this._props
  }

  getId() {
    return this._props.id
  }

  getAccessToken() {
    return this._props.access_token
  }

  getRefreshToken() {
    return this._props.refresh_token
  }
}
