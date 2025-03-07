import { UUID } from '@domain/shared/UUID'
import { SlotEntity } from './SlotEntity'
import { SlotType } from './models/SlotType'
import { DateTimeValue } from '@domain/shared/DateTime'
import { UserId } from '@domain/user/models/UserId'

export type SlotRepositoryCommonFilter = {
  slotType?: SlotType
  dateFrom?: DateTimeValue
  dateTo?: DateTimeValue
}

export default interface SlotRepository {
  create(slot: SlotEntity): Promise<SlotEntity>
  createMany(slots: SlotEntity[]): Promise<SlotEntity[]>
  save(slot: SlotEntity): Promise<SlotEntity>
  getById(slotId: UUID): Promise<SlotEntity>
  getAll(): Promise<SlotEntity[]>
  getFreeSlots(slotType?: SlotType, dateFrom?: DateTimeValue, dateTo?: DateTimeValue): Promise<SlotEntity[]>
  getMeetings(slotType?: SlotType, dateFrom?: DateTimeValue, dateTo?: DateTimeValue): Promise<SlotEntity[]>
  getSlots(slotType?: SlotType, dateFrom?: DateTimeValue, dateTo?: DateTimeValue): Promise<SlotEntity[]>
  getSlotsByUser(userId: UserId, filter?: SlotRepositoryCommonFilter): Promise<SlotEntity[]>
  setAsAvailable(slotId: UUID): Promise<void>
}
