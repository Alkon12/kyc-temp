import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { DateTimeValue } from '../shared/DateTime'
import { ContentQueueEntity, ContentQueueEntityProps } from './ContentQueueEntity'
import { ContentProvider } from './ContentProvider'
import { StringValue } from '@domain/shared/StringValue'
import { TaskFactory } from '@domain/task/TaskFactory'
import { ContentQueueKey } from './ContentQueueKey'

export type CreateContentQueueArgs = Merge<
  ContentQueueEntityProps,
  {
    id?: UUID
    createdAt?: DateTimeValue
  }
>

export class ContentQueueFactory {
  static fromDTO(dto: DTO<ContentQueueEntity>): ContentQueueEntity {
    return new ContentQueueEntity({
      id: new UUID(dto.id),
      contentProvider: new ContentProvider(dto.contentProvider),
      referenceKey: new ContentQueueKey(dto.referenceKey),
      taskId: new UUID(dto.taskId),
      metadata: dto.metadata ? new StringValue(dto.metadata) : undefined,
      createdAt: new DateTimeValue(dto.createdAt),

      task: dto.task ? TaskFactory.fromDTO(dto.task) : undefined,
    })
  }

  static create(args: CreateContentQueueArgs): ContentQueueEntity {
    return new ContentQueueEntity({
      ...args,
      id: new UUID(),
      createdAt: new DateTimeValue(new Date()),
    })
  }
}
