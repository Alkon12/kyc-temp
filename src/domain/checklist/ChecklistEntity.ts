import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { StringValue } from '@domain/shared/StringValue'
import { ChecklistId } from './models/ChecklistId'
import { ApplicationEntity } from '@domain/application/ApplicationEntity'
import { NumberValue } from '@domain/shared/NumberValue'
import { TaskEntity } from '@domain/task/TaskEntity'
import { BooleanValue } from '@domain/shared/BooleanValue'

export type ChecklistEntityProps = {
  id: ChecklistId
  name: StringValue
  order?: NumberValue
  parentId?: ChecklistId
  isDefault: BooleanValue
  dismissible: BooleanValue

  applications: ApplicationEntity[]
  tasks?: TaskEntity[]
  parent?: ChecklistEntity
  childs?: ChecklistEntity[]
}

export class ChecklistEntity extends AggregateRoot<'ChecklistEntity', ChecklistEntityProps> {
  get props(): ChecklistEntityProps {
    return this._props
  }

  getId() {
    return this._props.id
  }

  getOrder() {
    return this._props.order
  }

  getParentId() {
    return this._props.parentId
  }

  isDismissible() {
    return !!this._props.dismissible.toDTO()
  }
}
