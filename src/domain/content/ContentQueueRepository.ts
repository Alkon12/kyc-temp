import { UUID } from '@domain/shared/UUID'
import { ContentQueueEntity } from './ContentQueueEntity'

export default interface ContentQueueRepository {
  create(contentQueue: ContentQueueEntity): Promise<ContentQueueEntity>
  getAll(): Promise<ContentQueueEntity[]>
  delete(contentQueueId: UUID): Promise<void>
}
