import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { UUID } from '@domain/shared/UUID'
import { BooleanValue } from '../shared/BooleanValue'
import { DateTimeValue } from '../shared/DateTime'
import { UserEntity } from '@domain/user/models/UserEntity'
import { OfferEntity } from '@domain/offer/OfferEntity'
import { StringValue } from '@domain/shared/StringValue'
import { TaskRelevance } from './models/TaskRelevance'
import { ApplicationEntity } from '@domain/application/ApplicationEntity'
import { QuoteEntity } from '@domain/quote/QuoteEntity'
import { VehicleEntity } from '@domain/vehicle/models/VehicleEntity'
import { LeasingEntity } from '@domain/leasing/LeasingEntity'
import { ProductEntity } from '@domain/product/ProductEntity'
import { LeadEntity } from '@domain/lead/LeadEntity'
import { TaskTypeEntity } from './TaskTypeEntity'
import { TaskType } from './models/TaskType'
import { UserId } from '@domain/user/models/UserId'
import { ForbiddenError } from '@domain/error'
import { GroupEntity } from '@domain/user/models/GroupEntity'
import { ApplicationChecklistEntity } from '@domain/applicationChecklist/ApplicationChecklistEntity'
import { SlotEntity } from '@domain/slot/SlotEntity'
import { JsonValue } from '@domain/shared/JsonValue'

export type TaskEntityProps = {
  id: UUID
  message?: StringValue
  taskTypeId: TaskType
  dismissible: BooleanValue
  expiresAt?: DateTimeValue
  flaggedAt?: DateTimeValue
  relevance: TaskRelevance
  assignedUserId?: UserId
  originTaskId?: UUID
  leadId?: UUID
  offerId?: UUID
  quoteId?: UUID
  applicationId?: UUID
  leasingId?: UUID
  vehicleId?: UUID
  productId?: UUID
  slotId?: UUID
  done: BooleanValue
  acceptedAt?: DateTimeValue
  acceptedBy?: UserId
  declinedAt?: DateTimeValue
  declinedBy?: UserId
  dismissedAt?: DateTimeValue
  dismissedBy?: UserId
  createdAt?: DateTimeValue
  updatedAt?: DateTimeValue
  applicationChecklistId?: UUID
  customData?: JsonValue
  optional: BooleanValue

  taskType?: TaskTypeEntity
  assignedUser?: UserEntity
  acceptedByUser?: UserEntity
  declinedByUser?: UserEntity
  dismissedByUser?: UserEntity
  lead?: LeadEntity
  offer?: OfferEntity
  quote?: QuoteEntity
  application?: ApplicationEntity
  leasing?: LeasingEntity
  vehicle?: VehicleEntity
  product?: ProductEntity
  applicationChecklist?: ApplicationChecklistEntity
  slot?: SlotEntity
  assignedGroups?: GroupEntity[]
  originTask?: TaskEntity
  originatedTasks?: TaskEntity[]
}

export class TaskEntity extends AggregateRoot<'TaskEntity', TaskEntityProps> {
  get props(): TaskEntityProps {
    return this._props
  }

  getId(): UUID {
    return this._props.id
  }

  getExpiresAt(): DateTimeValue | undefined {
    return this._props.expiresAt
  }

  getTaskTypeId(): TaskType {
    return this._props.taskTypeId
  }

  getSlotId() {
    return this._props.slotId
  }

  getApplicationId() {
    return this._props.applicationId
  }

  getApplication() {
    return this._props.application
  }

  getQuote() {
    return this._props.quote
  }

  getApplicationChecklistId() {
    return this._props.applicationChecklistId
  }

  getApplicationChecklist() {
    return this._props.applicationChecklist
  }

  getChecklistApplicationId() {
    return this._props.applicationChecklistId
  }

  getMetadata() {
    return this._props.customData?.getJson()
  }

  isOptional() {
    return this._props.optional.toDTO()
  }

  isPending() {
    return !this.isDone()
  }

  isDone() {
    return !!this._props.done.toDTO()
  }

  setAsAccepted(userId: UserId, message?: StringValue) {
    this._validateForExistingState()

    this._props.done = new BooleanValue(true)
    this._props.acceptedBy = userId
    this._props.message = message
    this._props.acceptedAt = new DateTimeValue(new Date())
  }

  setAsDeclined(userId: UserId, message?: StringValue) {
    this._validateForExistingState()

    this._props.done = new BooleanValue(true)
    this._props.declinedBy = userId
    this._props.message = message
    this._props.declinedAt = new DateTimeValue(new Date())
  }

  setAsDismissed(userId: UserId, message?: StringValue) {
    this._validateForExistingState()
    if (!this._props.dismissible) {
      throw new ForbiddenError('Task is not dismissible')
    }

    this._props.done = new BooleanValue(true)
    this._props.dismissedBy = userId
    this._props.message = message
    this._props.dismissedAt = new DateTimeValue(new Date())
  }

  setMetadata(customData?: JsonValue) {
    this._props.customData = customData
  }

  private _validateForExistingState() {
    if (!!this._props.acceptedAt) {
      throw new ForbiddenError('Task is already accepted')
    }
    if (!!this._props.declinedAt) {
      throw new ForbiddenError('Task is already declined')
    }
    if (!!this._props.dismissedAt) {
      throw new ForbiddenError('Task is already dismissed')
    }
  }
}
