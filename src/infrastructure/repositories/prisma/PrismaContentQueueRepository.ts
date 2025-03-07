import prisma from '@client/providers/PrismaClient'
import { injectable } from 'inversify'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { ContentQueueFactory } from '@domain/content/ContentQueueFactory'
import { ContentQueueEntity } from '@domain/content/ContentQueueEntity'
import ContentQueueRepository from '@domain/content/ContentQueueRepository'
import { UUID } from '@domain/shared/UUID'

@injectable()
export class PrismaContentQueueRepository implements ContentQueueRepository {
  async create(contentQueue: ContentQueueEntity): Promise<ContentQueueEntity> {
    const createdContentQueue = await prisma.contentQueue.create({
      data: {
        ...contentQueue.toDTO(),
        task: undefined,
      },
    })

    return ContentQueueFactory.fromDTO(convertPrismaToDTO<ContentQueueEntity>(createdContentQueue))
  }

  async getAll(): Promise<ContentQueueEntity[]> {
    const queues = await prisma.contentQueue.findMany({
      include: {
        task: {
          include:{
            application:true
          }          
        },
      },
    })

    return queues.map((i) => ContentQueueFactory.fromDTO(convertPrismaToDTO<ContentQueueEntity>(i)))
  }

  async delete(contentQueueId: UUID): Promise<void> {
    await prisma.contentQueue.delete({
      where: {
        id: contentQueueId.toDTO(),
      },
    })

    return
  }
}
