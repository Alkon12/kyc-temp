import { NextResponse } from 'next/server'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { ContentQueueService } from '@service/ContentQueueService'
import { ContentQueueSituation, ContentService } from '@/application/service/ContentService'
import { TaskService } from '@service/TaskService'
import { TaskAction } from '@domain/task/models/TaskAction'
import { UserService } from '@service/UserService'
import { GetTaxPersonService } from '@/application/service/GetTaxPersonService'

export async function POST() {
  const contentQueueService = container.get<ContentQueueService>(DI.ContentQueueService)
  const contentService = container.get<ContentService>(DI.ContentService)
  const taskService = container.get<TaskService>(DI.TaskService)
  const userService = container.get<UserService>(DI.UserService)
  const tasxService = container.get<GetTaxPersonService>(DI.GetTaxPersonService)

  const queues = await contentQueueService.getAll()

  const processedQueues: ContentQueueSituation[] = []

  await Promise.all(
    queues.map(async (queue) => {
      const systemUser = await userService.getSystemUser()

      const jobStatus = await contentService.getQueueJob(queue.getReferenceKey())
      if (!jobStatus || jobStatus.status === 'PENDING' || jobStatus.status === 'UNKNOWN') {
        return queue
      }
      const queueTask = queue.getTask()
      if (queueTask) {
        if (jobStatus?.status === 'SUCCEEDED') {
          // UPDATE PAPERLESS RentApplicationID
          await contentService.updateCustomFields(jobStatus.storageKey, [
            {
              field: 2, // TODO: Could be dynamic ?
              value: queueTask.getApplicationId()!.toDTO(), // It can be undefined ?
            },
          ])

          // ACCEPT TASK
          await taskService.move({
            userId: systemUser.getId(),
            taskId: queueTask.getId(),
            taskAction: TaskAction.ACCEPT,
            metadata: {
              contentProvider: queue.getProvider(),
              contentStorageKey: jobStatus.storageKey,
            },
          })
        } else if (jobStatus?.status === 'FAILED') {
          await taskService.move({
            userId: systemUser.getId(),
            taskId: queueTask.getId(),
            taskAction: TaskAction.DECLINE,
            metadata: {
              message: jobStatus.statusMessage,
            },
          })
        }
      }

      await contentQueueService.delete(queue.getId())

      if (jobStatus) {
        processedQueues.push(jobStatus)
      }

      return queue
    }),
  )

  return NextResponse.json({
    status: 200,
    processedQueues: processedQueues.map((q) => ({
      status: q.status,
      queueKey: q.queueKey.toDTO(),
      storageKey: q.storageKey.toDTO(),
      statusMessage: q.statusMessage.toDTO(),
      createdAt: q.createdAt.toDTO(),
    })),
  })
}
