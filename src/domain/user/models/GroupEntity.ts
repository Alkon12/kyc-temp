import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { StringValue } from '@domain/shared/StringValue'
import { UserGroupEntity } from './UserGroupEntity'
import { GroupId } from './GroupId'

export type GroupEntityProps = {
  id: GroupId
  title: StringValue

  users: UserGroupEntity[]
}

export class GroupEntity extends AggregateRoot<'GroupEntity', GroupEntityProps> {
  get props(): GroupEntityProps {
    return this._props
  }
}
