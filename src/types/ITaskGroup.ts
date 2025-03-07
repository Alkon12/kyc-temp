import { TaskGroup } from '@prisma/client'
import { IGroup } from './IGroup'
import { ITask } from './ITask'

export type ITaskGroup = Omit<TaskGroup, 'task' | 'group' | 'assignedAt'> & {
  task: ITask
  group: IGroup
  assignedAt: string
}
