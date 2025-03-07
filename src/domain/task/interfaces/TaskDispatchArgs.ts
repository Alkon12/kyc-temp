import { TaskEntity } from '../TaskEntity'
import { TaskAction } from '../models/TaskAction'
import { UserId } from '@domain/user/models/UserId'
import { TaskMetadata } from './TaskMetadata'

export interface TaskDispatchArgs {
  userId: UserId
  task: TaskEntity
  action: TaskAction
  metadata?: TaskMetadata
}
