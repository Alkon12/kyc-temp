import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { TaskGroupEntity, TaskGroupEntityProps } from './TaskGroupEntity'
import { DateTimeValue } from '../shared/DateTime'
import { TaskFactory } from './TaskFactory'
import { GroupFactory } from '@domain/user/GroupFactory'
import { GroupId } from '@domain/user/models/GroupId'

export class TaskGroupFactory {
  static fromDTO(dto: DTO<TaskGroupEntity>): TaskGroupEntity {
    return new TaskGroupEntity({
      taskId: new UUID(dto.taskId),
      groupId: new GroupId(dto.groupId),
      assignedAt: new DateTimeValue(dto.assignedAt),
      assignedBy: dto.assignedBy ? new UUID(dto.assignedBy) : undefined,

      task: TaskFactory.fromDTO(dto.task),
      group: GroupFactory.fromDTO(dto.group),
    })
  }
}
