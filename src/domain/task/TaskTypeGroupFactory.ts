import { DTO } from '@domain/kernel/DTO'
import { TaskTypeGroupEntity } from './TaskTypeGroupEntity'
import { GroupFactory } from '@domain/user/GroupFactory'
import { GroupId } from '@domain/user/models/GroupId'
import { TaskTypeFactory } from './TaskTypeFactory'
import { TaskType } from './models/TaskType'

export class TaskTypeGroupFactory {
  static fromDTO(dto: DTO<TaskTypeGroupEntity>): TaskTypeGroupEntity {
    return new TaskTypeGroupEntity({
      taskTypeId: new TaskType(dto.taskTypeId),
      groupId: new GroupId(dto.groupId),

      taskType: TaskTypeFactory.fromDTO(dto.taskType),
      group: GroupFactory.fromDTO(dto.group),
    })
  }
}
