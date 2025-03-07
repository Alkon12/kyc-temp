import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { GroupEntity } from './GroupEntity'
import { UserEntity } from './UserEntity'
import { DateTimeValue } from '@domain/shared/DateTime'
import { UUID } from '@domain/shared/UUID'
import { GroupId } from './GroupId'
import { UserId } from './UserId'

export type UserGroupEntityProps = {
  userId: UserId
  groupId: GroupId
  assignedAt: DateTimeValue
  assignedBy?: UUID

  user?: UserEntity // It should be present always, but we put as optional to scope repository missing joins
  group?: GroupEntity
}

export class UserGroupEntity extends AggregateRoot<'UserGroupEntity', UserGroupEntityProps> {
  get props(): UserGroupEntityProps {
    return this._props
  }

  getGroupId() {
    return this._props.groupId
  }
}
