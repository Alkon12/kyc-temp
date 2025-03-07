import { DateTimeValue } from '@domain/shared/DateTime'
import { UUID } from '@domain/shared/UUID'
import { SlotEntity } from './SlotEntity'
import { SlotType } from './models/SlotType'
import { UserId } from '@domain/user/models/UserId'

export type SlotCommonFilter = {
  slotType?: SlotType
  dateFrom?: DateTimeValue
  dateTo?: DateTimeValue
}

export default abstract class AbstractSlotService {
  abstract getFreeSlots(slotType: SlotType, dateFrom?: DateTimeValue, dateTo?: DateTimeValue): Promise<SlotEntity[]>
  abstract getMeetings(slotType: SlotType, dateFrom?: DateTimeValue, dateTo?: DateTimeValue): Promise<SlotEntity[]>
  abstract getSlots(slotType: SlotType, dateFrom?: DateTimeValue, dateTo?: DateTimeValue): Promise<SlotEntity[]>
  abstract getUserSlots(userId: UserId, filter?: SlotCommonFilter): Promise<SlotEntity[]>
  abstract getDatesWithFreeSlots(
    slotType: SlotType,
    dateFrom?: DateTimeValue,
    dateTo?: DateTimeValue,
  ): Promise<DateTimeValue[]>
  abstract pickSlot(slotId: UUID, guestUserId: UserId, prospectId?: UUID): Promise<void>
  abstract freeSlot(slotId: UUID): Promise<void>
  abstract populateSlots(
    slotType: SlotType,
    dateFrom: DateTimeValue,
    dateTo: DateTimeValue,
    hostUserId: UserId,
  ): Promise<SlotEntity[]>
  abstract getById(slotId: UUID): Promise<SlotEntity>
}
