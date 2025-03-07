import { TaskTypeGroup } from '@prisma/client'
import { IGroup } from './IGroup'
import { ITaskType } from './ITaskType'

export type ITaskTypeGroup = Omit<TaskTypeGroup, 'taskType' | 'group'> & {
  taskType: ITaskType
  group: IGroup
}
