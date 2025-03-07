import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { BooleanValue } from '../shared/BooleanValue'
import { StringValue } from '@domain/shared/StringValue'
import { TaskEntity } from './TaskEntity'
import { TaskType } from './models/TaskType'
import { TaskTypeGroupEntity } from './TaskTypeGroupEntity'

export type TaskTypeEntityProps = {
  id: TaskType
  name: StringValue

  tasks: TaskEntity[]
}

export class TaskTypeEntity extends AggregateRoot<'TaskTypeEntity', TaskTypeEntityProps> {
  get props(): TaskTypeEntityProps {
    return this._props
  }
}
