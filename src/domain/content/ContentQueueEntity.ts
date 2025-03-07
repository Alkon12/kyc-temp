import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { DateTimeValue } from '@domain/shared/DateTime'
import { UUID } from '@domain/shared/UUID'
import { ContentProvider } from './ContentProvider'
import { StringValue } from '@domain/shared/StringValue'
import { TaskEntity } from '@domain/task/TaskEntity'
import { ContentQueueKey } from './ContentQueueKey'

export type ContentQueueEntityProps = {
  id: UUID
  contentProvider: ContentProvider
  referenceKey: ContentQueueKey
  taskId?: UUID
  metadata?: StringValue
  createdAt: DateTimeValue

  task?: TaskEntity
}

export class ContentQueueEntity extends AggregateRoot<'ContentQueueEntity', ContentQueueEntityProps> {
  get props(): ContentQueueEntityProps {
    return this._props
  }

  getId() {
    return this._props.id
  }

  getTask() {
    return this._props.task
  }

  getProvider() {
    return this._props.contentProvider
  }

  getReferenceKey() {
    return this._props.referenceKey
  }
}
