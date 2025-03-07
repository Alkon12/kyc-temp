import { TaskEntity } from '@domain/task/TaskEntity'
import { UUID } from '@domain/shared/UUID'
import { UserId } from '@domain/user/models/UserId'
import { GroupId } from '@domain/user/models/GroupId'
import { TaskTypeEntity } from './TaskTypeEntity'
import { TaskGroupEntity } from './TaskGroupEntity'
import { TaskType } from './models/TaskType'
import { TaskTypeGroupEntity } from './TaskTypeGroupEntity'

export default interface TaskRepository {
  create(task: TaskEntity, assignedGroups?: GroupId[]): Promise<TaskEntity>
  save(task: TaskEntity): Promise<TaskEntity>
  getById(taskId: UUID): Promise<TaskEntity | null>
  getByUser(userId: UserId): Promise<TaskEntity[]>
  getByGroups(groups: GroupId[]): Promise<TaskEntity[]>
  getTaskTypes(): Promise<TaskTypeEntity[]>
  getTaskGroups(taskId: UUID): Promise<TaskGroupEntity[]>
  getTaskTypeGroups(taskTypeId: TaskType): Promise<TaskTypeGroupEntity[]>
  getByApplicationIdAndType(applicationId: UUID, taskTypes: TaskType[]): Promise<TaskEntity[]>
}
