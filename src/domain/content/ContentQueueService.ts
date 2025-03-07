import { UUID } from '@domain/shared/UUID'
import { ContentQueueEntity, ContentQueueEntityProps } from './ContentQueueEntity'
import { DTO } from '@domain/kernel/DTO'

export default abstract class AbstractContentQueueService {
  abstract create(props: Partial<ContentQueueEntityProps>): Promise<ContentQueueEntity>
  abstract getAll(): Promise<ContentQueueEntity[]>
  abstract delete(contentQueueId: UUID): Promise<void>
}
