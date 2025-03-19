import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { StringValue } from '@domain/shared/StringValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { PermissionId } from './PermissionId'

export type PermissionEntityProps = {
  id: PermissionId
  permissionName: StringValue
  description?: StringValue
  createdAt?: DateTimeValue
}

export class PermissionEntity extends AggregateRoot<'PermissionEntity', PermissionEntityProps> {
  get props(): PermissionEntityProps {
    return this._props
  }

  getId() {
    return this._props.id
  }

  getPermissionName() {
    return this._props.permissionName
  }

  getDescription() {
    return this._props.description
  }

  getCreatedAt() {
    return this._props.createdAt
  }
}