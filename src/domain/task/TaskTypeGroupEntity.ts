import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { GroupId } from '@domain/user/models/GroupId'
import { GroupEntity } from '@domain/user/models/GroupEntity'
import { TaskTypeEntity } from './TaskTypeEntity'
import { TaskType } from './models/TaskType'

export type TaskTypeGroupEntityProps = {
  taskTypeId: TaskType
  groupId: GroupId

  taskType: TaskTypeEntity
  group: GroupEntity
}

export class TaskTypeGroupEntity extends AggregateRoot<'TaskTypeGroupEntity', TaskTypeGroupEntityProps> {
  get props(): TaskTypeGroupEntityProps {
    return this._props
  }

  getGroup(): GroupEntity {
    return this._props.group
  }

  getTaskType(): TaskTypeEntity {
    return this._props.taskType
  }
}
