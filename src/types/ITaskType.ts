import { TaskType } from '@prisma/client'
import { ITask } from './ITask'
import { ITaskTypeGroup } from './ITaskTypeGroup'

export type ITaskType = Omit<TaskType, 'tasks' | 'assignedGroups'> & {
  tasks: ITask[]
  assignedGroups: ITaskTypeGroup[]
}
