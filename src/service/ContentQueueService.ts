import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import AbstractContentQueueService from '@domain/content/ContentQueueService'
import { ContentQueueFactory, CreateContentQueueArgs } from '@domain/content/ContentQueueFactory'
import { ContentQueueEntity } from '@domain/content/ContentQueueEntity'
import type ContentQueueRepository from '@domain/content/ContentQueueRepository'
import { UUID } from '@domain/shared/UUID'

@injectable()
export class ContentQueueService implements AbstractContentQueueService {
  @inject(DI.ContentQueueRepository)
  private readonly _contentQueueRepository!: ContentQueueRepository

  async create(props: CreateContentQueueArgs): Promise<ContentQueueEntity> {
    const prepareContentQueue = ContentQueueFactory.create({
      taskId: props.taskId,
      contentProvider: props.contentProvider,
      referenceKey: props.referenceKey,
      metadata: props.metadata,
    })

    return this._contentQueueRepository.create(prepareContentQueue)
  }

  async getAll(): Promise<ContentQueueEntity[]> {
    return this._contentQueueRepository.getAll()
  }

  async delete(contentQueueId: UUID): Promise<void> {
    return this._contentQueueRepository.delete(contentQueueId)
  }
}
