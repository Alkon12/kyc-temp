import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { DateTimeValue } from '@domain/shared/DateTime'
import { UUID } from '@domain/shared/UUID'
import { ApplicationEntity } from '@domain/application/ApplicationEntity'
import { ChecklistId } from '../checklist/models/ChecklistId'
import { ChecklistEntity } from '../checklist/ChecklistEntity'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { TaskEntity } from '@domain/task/TaskEntity'
import { UserEntity } from '@domain/user/models/UserEntity'
import { UserId } from '@domain/user/models/UserId'
import { StringValue } from '@domain/shared/StringValue'
import { ForbiddenError } from '@domain/error'
import { NumberValue } from '@domain/shared/NumberValue'

export type ApplicationChecklistEntityProps = {
  id: UUID
  applicationId: UUID
  checklistId: ChecklistId
  completed: BooleanValue
  completedAt?: DateTimeValue
  started: BooleanValue
  startedAt?: DateTimeValue
  parentId?: UUID
  createdAt: DateTimeValue
  updatedAt: DateTimeValue
  dismissible: BooleanValue
  dismissedAt?: DateTimeValue
  dismissedBy?: UserId
  dismissedMessage?: StringValue
  order?: NumberValue

  dismissedByUser?: UserEntity
  application?: ApplicationEntity
  checklist?: ChecklistEntity
  tasks?: TaskEntity[]
  parent?: ApplicationChecklistEntity
  childs?: ApplicationChecklistEntity[]
}

export class ApplicationChecklistEntity extends AggregateRoot<
  'ApplicationChecklistEntity',
  ApplicationChecklistEntityProps
> {
  get props(): ApplicationChecklistEntityProps {
    return this._props
  }

  getId(): UUID {
    return this._props.id
  }

  getChecklistId(): ChecklistId {
    return this._props.checklistId
  }

  getApplicationId(): UUID {
    return this._props.applicationId
  }

  getChecklist() {
    return this._props.checklist
  }

  getTasks() {
    return this._props.tasks
  }

  isActive(): boolean {
    return this.isStarted() && !this.isCompleted()
  }

  isPending(): boolean {
    return !this.isStarted() && !this.isDismissed() && !this.isCompleted()
  }

  isStarted(): boolean {
    return !!this._props.startedAt
  }

  isCompleted(): boolean {
    return !!this._props.completedAt
  }

  isDismissed(): boolean {
    return !!this._props.dismissedAt
  }

  getChilds() {
    return this._props.childs ?? []
  }

  hasChilds() {
    return this.getChilds().length > 0
  }

  getOrder() {
    return this._props.order
  }

  setAsDismissed(userId: UserId, message?: StringValue) {
    if (!!this._props.completedAt) {
      throw new ForbiddenError('Checklist is already completed')
    }
    if (!!this._props.dismissedAt) {
      throw new ForbiddenError('Checklist is already dismissed')
    }
    if (!this._props.dismissible.toDTO()) {
      throw new ForbiddenError('Checklist is not dismissible')
    }

    this._props.dismissedBy = userId
    this._props.dismissedMessage = message
    this._props.dismissedAt = new DateTimeValue(new Date())
  }
}
