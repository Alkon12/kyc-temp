import { SlotEntity } from '@domain/slot/SlotEntity'
import { DateTimeValue } from '@domain/shared/DateTime'
import { DI } from '@infrastructure'
import { inject, injectable } from 'inversify'
import { NotFoundError } from '@domain/error'
import { UserId } from '@domain/user/models/UserId'
import { SlotType } from '@domain/slot/models/SlotType'
import AbstractSlotService, { SlotCommonFilter } from '@domain/slot/SlotService'
import { UUID } from '@domain/shared/UUID'
import type SlotRepository from '@domain/slot/SlotRepository'
import { SlotFactory } from '@domain/slot/SlotFactory'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { NumberValue } from '@domain/shared/NumberValue'
import moment from 'moment'
import { type DateService } from '@/application/service/DateService'

export interface Schedule {
  //weekDay: NumberValue // pasar a WeekDay VO
  //hostUserId: UserId
  hours: NumberValue
  minutes: NumberValue
  //duration: NumberValue
}

@injectable()
export class SlotService implements AbstractSlotService {
  @inject(DI.SlotRepository) private readonly _slotRepository!: SlotRepository
  @inject(DI.DateService) private readonly _dateService!: DateService

  async getFreeSlots(slotType: SlotType, dateFrom?: DateTimeValue, dateTo?: DateTimeValue): Promise<SlotEntity[]> {
    const freeSlots = await this._slotRepository.getFreeSlots(slotType, dateFrom, dateTo)
    return freeSlots
  }

  async getMeetings(slotType: SlotType, dateFrom?: DateTimeValue, dateTo?: DateTimeValue): Promise<SlotEntity[]> {
    return this._slotRepository.getMeetings(slotType, dateFrom, dateTo)
  }

  async getSlots(slotType: SlotType, dateFrom?: DateTimeValue, dateTo?: DateTimeValue): Promise<SlotEntity[]> {
    return this._slotRepository.getSlots(slotType, dateFrom, dateTo)
  }

  async getUserSlots(userId: UserId, filter?: SlotCommonFilter): Promise<SlotEntity[]> {
    return this._slotRepository.getSlotsByUser(userId, filter)
  }

  async getById(slotId: UUID): Promise<SlotEntity> {
    return this._slotRepository.getById(slotId)
  }

  async getDatesWithFreeSlots(
    slotType: SlotType,
    dateFrom?: DateTimeValue,
    dateTo?: DateTimeValue,
  ): Promise<DateTimeValue[]> {
    const slots = await this._slotRepository.getFreeSlots(slotType, dateFrom, dateTo)

    const dates = slots.map((s) => s.getStartsAt()).filter((s) => !!s)
    const datesGrouped = Object.groupBy(dates, (s) => s.toFormat('YYYY-MM-DD'))
    const res = Object.keys(datesGrouped).map((dtv) => new DateTimeValue(dtv))

    return res
  }

  async pickSlot(slotId: UUID, guestUserId: UserId, prospectId?: UUID): Promise<void> {
    const slot = await this._slotRepository.getById(slotId)
    if (!slot) {
      throw new NotFoundError('Slot not found')
    }

    slot.setAsPicked(guestUserId)
    if (prospectId) {
      slot.setProspectId(prospectId)
    }

    this._slotRepository.save(slot)

    return
  }

  async freeSlot(slotId: UUID): Promise<void> {
    return this._slotRepository.setAsAvailable(slotId)
  }

  async populateSlots(
    slotType: SlotType,
    dateFrom: DateTimeValue,
    dateTo: DateTimeValue,
    hostUserId: UserId,
  ): Promise<SlotEntity[]> {
    const WEEKLY_SCHEDULE: Schedule[] = [
      {
        hours: new NumberValue(9),
        minutes: new NumberValue(0),
      },
      {
        hours: new NumberValue(9),
        minutes: new NumberValue(30),
      },
      {
        hours: new NumberValue(10),
        minutes: new NumberValue(0),
      },
      {
        hours: new NumberValue(10),
        minutes: new NumberValue(30),
      },
      {
        hours: new NumberValue(11),
        minutes: new NumberValue(0),
      },
      {
        hours: new NumberValue(11),
        minutes: new NumberValue(30),
      },
      {
        hours: new NumberValue(12),
        minutes: new NumberValue(0),
      },
      {
        hours: new NumberValue(12),
        minutes: new NumberValue(30),
      },
      {
        hours: new NumberValue(13),
        minutes: new NumberValue(0),
      },
      {
        hours: new NumberValue(13),
        minutes: new NumberValue(30),
      },
      {
        hours: new NumberValue(15),
        minutes: new NumberValue(0),
      },
      {
        hours: new NumberValue(15),
        minutes: new NumberValue(30),
      },
      {
        hours: new NumberValue(16),
        minutes: new NumberValue(0),
      },
      {
        hours: new NumberValue(16),
        minutes: new NumberValue(30),
      },
      {
        hours: new NumberValue(17),
        minutes: new NumberValue(0),
      },
      {
        hours: new NumberValue(17),
        minutes: new NumberValue(30),
      },
    ]

    const WEEKEND_SCHEDULE: Schedule[] = [
      {
        hours: new NumberValue(9),
        minutes: new NumberValue(0),
      },
      {
        hours: new NumberValue(9),
        minutes: new NumberValue(30),
      },
      {
        hours: new NumberValue(10),
        minutes: new NumberValue(0),
      },
      {
        hours: new NumberValue(10),
        minutes: new NumberValue(30),
      },
      {
        hours: new NumberValue(11),
        minutes: new NumberValue(0),
      },
      {
        hours: new NumberValue(11),
        minutes: new NumberValue(30),
      },
      {
        hours: new NumberValue(12),
        minutes: new NumberValue(15),
      },
    ]

    const dateRange = this._dateService.getDateRange(dateFrom.toDTO(), dateTo.toDTO())

    const slots: SlotEntity[] = dateRange.reduce((acc, date) => {
      const dayOfWeek = date.getDay()

      if(dayOfWeek === 0) return acc

      const schedulesForDay = dayOfWeek === 6 ? WEEKEND_SCHEDULE : WEEKLY_SCHEDULE

      const slotsForDay = schedulesForDay.map((schedule) => {
        const startsAt = new Date(date)
        startsAt.setHours(schedule.hours.toDTO())
        startsAt.setMinutes(schedule.minutes.toDTO())

        const endsAt = moment(startsAt).add(30, 'm').toDate()

        return SlotFactory.create({
          startsAt: new DateTimeValue(startsAt),
          endsAt: new DateTimeValue(endsAt),
          slotType,
          free: new BooleanValue(true),
          hostUserId: hostUserId,
        })
      })

      return [...acc, ...slotsForDay]
    }, [] as SlotEntity[])

    await this._slotRepository.createMany(slots)

    return slots
  }
}
