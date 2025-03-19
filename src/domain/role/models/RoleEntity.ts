import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { StringValue } from '@domain/shared/StringValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { RoleId } from './RoleId'

export type RoleEntityProps = {
  id: RoleId
  roleName: StringValue
  description?: StringValue
  createdAt?: DateTimeValue
}

export class RoleEntity extends AggregateRoot<'RoleEntity', RoleEntityProps> {
  get props(): RoleEntityProps {
    return this._props
  }

  getId() {
    return this._props.id
  }

  getRoleName() {
    return this._props.roleName
  }

  getDescription() {
    return this._props.description
  }

  getCreatedAt() {
    return this._props.createdAt
  }
}