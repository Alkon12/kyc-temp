import { TaskEntity, TaskEntityProps } from './TaskEntity'
import { UUID } from '@domain/shared/UUID'
import { TaskAction } from './models/TaskAction'
import { UserId } from '@domain/user/models/UserId'
import { CreateTaskArgs } from './interfaces/CreateTaskArgs'
import { TasksByUserResponse } from './interfaces/TasksByUserResponse'
import { TaskTypeEntity } from './TaskTypeEntity'
import { GroupEntity } from '@domain/user/models/GroupEntity'
import { TaskType } from './models/TaskType'
import { GroupId } from '@domain/user/models/GroupId'
import { TaskMetadata } from './interfaces/TaskMetadata'
import { DTO } from '@domain/kernel/DTO'

export type TaskMoveProps = {
  userId: UserId
  taskId: UUID
  taskAction: TaskAction
  metadata?: TaskMetadata
}

export default abstract class AbstractTaskService {
  abstract create(props: CreateTaskArgs, assignedGroups?: GroupId[]): Promise<TaskEntity>
  abstract update(props: DTO<TaskEntityProps>): Promise<TaskEntity>
  abstract getById(taskId: UUID): Promise<TaskEntity | null>
  abstract getTaskGroups(taskId: UUID): Promise<GroupEntity[]>
  abstract getTaskTypeGroups(taskTypeId: TaskType): Promise<GroupEntity[]>
  abstract getByUser(userId: UserId): Promise<TasksByUserResponse>
  abstract getUserPendingTasks(userId: UserId): Promise<TaskEntity[]>
  //abstract updateMessage(): Promise<Boolean>
  abstract move(props: TaskMoveProps): Promise<Boolean>
  abstract taskTypes(): Promise<TaskTypeEntity[]>
  abstract getPendingByTypeAndApplication(applicationId: UUID, taskTypes: TaskType[]): Promise<TaskEntity[]>
}
