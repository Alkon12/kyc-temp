import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { ApplicationChecklistEntity } from './ApplicationChecklistEntity'
import { DateTimeValue } from '../shared/DateTime'
import { ChecklistId } from '../checklist/models/ChecklistId'
import { ChecklistFactory } from '@domain/checklist/ChecklistFactory'
import { TaskFactory } from '@domain/task/TaskFactory'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { UserId } from '@domain/user/models/UserId'
import { StringValue } from '@domain/shared/StringValue'
import { UserFactory } from '@domain/user/UserFactory'
import { ApplicationFactory } from '@domain/application/ApplicationFactory'
import { NumberValue } from '@domain/shared/NumberValue'

export class ApplicationChecklistFactory {
  static fromDTO(dto: DTO<ApplicationChecklistEntity>): ApplicationChecklistEntity {
    return new ApplicationChecklistEntity({
      id: new UUID(dto.id),
      applicationId: new UUID(dto.applicationId),
      checklistId: new ChecklistId(dto.checklistId),
      completed: new BooleanValue(dto.completed),
      completedAt: dto.completedAt ? new DateTimeValue(dto.completedAt) : undefined,
      started: new BooleanValue(dto.started),
      startedAt: dto.startedAt ? new DateTimeValue(dto.startedAt) : undefined,
      createdAt: new DateTimeValue(dto.createdAt),
      updatedAt: new DateTimeValue(dto.updatedAt),
      dismissible: new BooleanValue(dto.dismissible),
      dismissedAt: dto.dismissedAt ? new DateTimeValue(dto.dismissedAt) : undefined,
      dismissedBy: dto.dismissedBy ? new UserId(dto.dismissedBy) : undefined,
      dismissedMessage: dto.dismissedMessage ? new StringValue(dto.dismissedMessage) : undefined,
      order: dto.order ? new NumberValue(dto.order) : undefined,

      application: dto.application ? ApplicationFactory.fromDTO(dto.application) : undefined,
      checklist: dto.checklist ? ChecklistFactory.fromDTO(dto.checklist) : undefined,
      tasks: dto.tasks ? dto.tasks.map((t) => TaskFactory.fromDTO(t)) : [],
      parent: dto.parent ? ApplicationChecklistFactory.fromDTO(dto.parent) : undefined,
      childs: dto.childs ? dto.childs.map((t) => ApplicationChecklistFactory.fromDTO(t)) : [],
      dismissedByUser: dto.dismissedByUser ? UserFactory.fromDTO(dto.dismissedByUser) : undefined,
    })
  }
}
