import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { TaskEntity } from './TaskEntity'
import { DateTimeValue } from '@domain/shared/DateTime'
import { UUID } from '@domain/shared/UUID'
import { GroupId } from '@domain/user/models/GroupId'
import { GroupEntity } from '@domain/user/models/GroupEntity'

export type TaskGroupEntityProps = {
  taskId: UUID
  groupId: GroupId
  assignedAt: DateTimeValue
  assignedBy?: UUID

  task: TaskEntity // It should be present always, but we put as optional to scope repository missing joins
  group: GroupEntity
}

export class TaskGroupEntity extends AggregateRoot<'TaskGroupEntity', TaskGroupEntityProps> {
  get props(): TaskGroupEntityProps {
    return this._props
  }

  getGroup(): GroupEntity {
    return this._props.group
  }

  getTask(): TaskEntity {
    return this._props.task
  }
}
