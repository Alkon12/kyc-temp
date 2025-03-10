import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { StringValue } from '@domain/shared/StringValue'
import { DateTimeValue } from '../../shared/DateTime'
import { UserGroupEntity } from './UserGroupEntity'
import { UserId } from './UserId'
import { PhoneNumber } from '@domain/shared/PhoneNumber'
import { Email } from '@domain/shared/Email'
import { AccountEntity } from './AccountEntity'

export type UserEntityProps = {
  id: UserId
  firstName?: StringValue
  lastName?: StringValue
  email?: Email
  emailVerified?: DateTimeValue
  phoneNumber?: PhoneNumber
  picture?: StringValue

  hashedPassword?: StringValue  
  createdAt?: DateTimeValue
  updatedAt?: DateTimeValue

  groups: UserGroupEntity[]
  accounts: AccountEntity[]
}

export class UserEntity extends AggregateRoot<'UserEntity', UserEntityProps> {
  get props(): UserEntityProps {
    return this._props
  }

  getHashedPassword() {
    return this._props.hashedPassword
  }

  getId() {
    return this._props.id
  }

  getEmail() {
    return this._props.email
  }

  getPhoneNumber() {
    return this._props.phoneNumber
  }

  getFirstName() {
    return this._props.firstName
  }

  getLastName() {
    return this._props.lastName
  }

  getGroups() {
    return this._props.groups
  }

  getPicture() {
    return this._props.picture
  }

  getAccounts() {
    return this._props.accounts
  }
}
