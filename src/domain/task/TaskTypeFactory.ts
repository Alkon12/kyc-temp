import { DTO } from '@domain/kernel/DTO'
import { TaskTypeEntity } from './TaskTypeEntity'
import { TaskType } from './models/TaskType'
import { StringValue } from '@domain/shared/StringValue'
import { TaskFactory } from './TaskFactory'

export class TaskTypeFactory {
  static fromDTO(dto: DTO<TaskTypeEntity>): TaskTypeEntity {
    return new TaskTypeEntity({
      id: new TaskType(dto.id),
      name: new StringValue(dto.name),
      tasks: dto.tasks ? dto.tasks.map((t) => TaskFactory.fromDTO(t)) : [],
    })
  }
}
