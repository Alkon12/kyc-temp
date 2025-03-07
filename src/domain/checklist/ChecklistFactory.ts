import { DTO } from '@domain/kernel/DTO'
import { ChecklistEntity } from './ChecklistEntity'
import { ChecklistId } from './models/ChecklistId'
import { StringValue } from '@domain/shared/StringValue'
import { ApplicationFactory } from '../application/ApplicationFactory'
import { TaskFactory } from '@domain/task/TaskFactory'
import { NumberValue } from '@domain/shared/NumberValue'
import { BooleanValue } from '@domain/shared/BooleanValue'

export class ChecklistFactory {
  static fromDTO(dto: DTO<ChecklistEntity>): ChecklistEntity {
    return new ChecklistEntity({
      id: new ChecklistId(dto.id),
      name: new StringValue(dto.name),
      order: dto.order ? new NumberValue(dto.order) : undefined,
      parentId: dto.parentId ? new ChecklistId(dto.parentId) : undefined,
      isDefault: new BooleanValue(dto.isDefault),
      dismissible: new BooleanValue(dto.dismissible),

      applications: dto.applications ? dto.applications.map((t) => ApplicationFactory.fromDTO(t)) : [],
      tasks: dto.tasks ? dto.tasks.map((t) => TaskFactory.fromDTO(t)) : [],
      parent: dto.parent ? ChecklistFactory.fromDTO(dto.parent) : undefined,
      childs: dto.childs ? dto.childs.map((t) => ChecklistFactory.fromDTO(t)) : [],
    })
  }
}
