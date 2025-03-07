import { ContentQueue } from '@prisma/client'
import { ITask } from './ITask'

export type IContentQueue = Omit<ContentQueue, 'createdAt' | 'task'> & {
  createdAt: string
  task: ITask
}
