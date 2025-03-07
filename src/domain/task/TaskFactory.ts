import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { TaskEntity } from './TaskEntity'
import { BooleanValue } from '../shared/BooleanValue'
import { DateTimeValue } from '../shared/DateTime'
import { UserFactory } from '@domain/user/UserFactory'
import { OfferFactory } from '@domain/offer/OfferFactory'
import { TaskRelevance } from './models/TaskRelevance'
import { StringValue } from '@domain/shared/StringValue'
import { QuoteFactory } from '@domain/quote/QuoteFactory'
import { ApplicationFactory } from '@domain/application/ApplicationFactory'
import { LeasingFactory } from '@domain/leasing/LeasingFactory'
import { VehicleFactory } from '@domain/vehicle/VehicleFactory'
import { ProductFactory } from '@domain/product/ProductFactory'
import { TaskType } from './models/TaskType'
import { TaskTypeFactory } from './TaskTypeFactory'
import { UserId } from '@domain/user/models/UserId'
import { CreateTaskArgs } from './interfaces/CreateTaskArgs'
import { SlotFactory } from '@domain/slot/SlotFactory'
import { JsonValue } from '@domain/shared/JsonValue'
import { ApplicationChecklistFactory } from '@domain/applicationChecklist/ApplicationChecklistFactory'

export class TaskFactory {
  static fromDTO(dto: DTO<TaskEntity>): TaskEntity {
    return new TaskEntity({
      id: new UUID(dto.id),
      message: dto.message ? new StringValue(dto.message) : undefined,
      dismissible: new BooleanValue(dto.dismissible),
      done: new BooleanValue(dto.done),
      expiresAt: dto.expiresAt ? new DateTimeValue(dto.expiresAt) : undefined,
      flaggedAt: dto.flaggedAt ? new DateTimeValue(dto.flaggedAt) : undefined,
      relevance: new TaskRelevance(dto.relevance),
      taskTypeId: new TaskType(dto.taskTypeId),
      assignedUserId: dto.assignedUserId ? new UserId(dto.assignedUserId) : undefined,
      offerId: dto.offerId ? new UUID(dto.offerId) : undefined,
      quoteId: dto.quoteId ? new UUID(dto.quoteId) : undefined,
      originTaskId: dto.originTaskId ? new UUID(dto.originTaskId) : undefined,
      applicationId: dto.applicationId ? new UUID(dto.applicationId) : undefined,
      leasingId: dto.leasingId ? new UUID(dto.leasingId) : undefined,
      vehicleId: dto.vehicleId ? new UUID(dto.vehicleId) : undefined,
      productId: dto.productId ? new UUID(dto.productId) : undefined,
      slotId: dto.slotId ? new UUID(dto.slotId) : undefined,
      dismissedAt: dto.dismissedAt ? new DateTimeValue(dto.dismissedAt) : undefined,
      dismissedBy: dto.dismissedBy ? new UserId(dto.dismissedBy) : undefined,
      acceptedAt: dto.acceptedAt ? new DateTimeValue(dto.acceptedAt) : undefined,
      acceptedBy: dto.acceptedBy ? new UserId(dto.acceptedBy) : undefined,
      declinedAt: dto.declinedAt ? new DateTimeValue(dto.declinedAt) : undefined,
      declinedBy: dto.declinedBy ? new UserId(dto.declinedBy) : undefined,
      createdAt: dto.createdAt ? new DateTimeValue(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new DateTimeValue(dto.updatedAt) : undefined,
      applicationChecklistId: dto.applicationChecklistId ? new UUID(dto.applicationChecklistId) : undefined,
      customData: dto.customData ? new JsonValue(dto.customData) : undefined,
      optional: new BooleanValue(dto.optional),
      taskType: dto.taskType ? TaskTypeFactory.fromDTO(dto.taskType) : undefined,

      assignedUser: dto.assignedUser ? UserFactory.fromDTO(dto.assignedUser) : undefined,
      acceptedByUser: dto.acceptedByUser ? UserFactory.fromDTO(dto.acceptedByUser) : undefined,
      declinedByUser: dto.declinedByUser ? UserFactory.fromDTO(dto.declinedByUser) : undefined,
      dismissedByUser: dto.dismissedByUser ? UserFactory.fromDTO(dto.dismissedByUser) : undefined,
      offer: dto.offer ? OfferFactory.fromDTO(dto.offer) : undefined,
      quote: dto.quote ? QuoteFactory.fromDTO(dto.quote) : undefined,
      application: dto.application ? ApplicationFactory.fromDTO(dto.application) : undefined,
      applicationChecklist: dto.applicationChecklist
        ? ApplicationChecklistFactory.fromDTO(dto.applicationChecklist)
        : undefined,
      leasing: dto.leasing ? LeasingFactory.fromDTO(dto.leasing) : undefined,
      vehicle: dto.vehicle ? VehicleFactory.fromDTO(dto.vehicle) : undefined,
      product: dto.product ? ProductFactory.fromDTO(dto.product) : undefined,
      slot: dto.slot ? SlotFactory.fromDTO(dto.slot) : undefined,
      originTask: dto.originTask ? TaskFactory.fromDTO(dto.originTask) : undefined,
      originatedTasks: dto.originatedTasks?.map(TaskFactory.fromDTO),
    })
  }

  static create(args: CreateTaskArgs): TaskEntity {
    return new TaskEntity({
      ...args,
      id: new UUID(),
      relevance: args.relevance ? args.relevance : new TaskRelevance(1),
      optional: args.optional ? args.optional : new BooleanValue(false),
      dismissible: args.dismissible ? args.dismissible : new BooleanValue(false),
      done: new BooleanValue(false),
    })
  }
}
