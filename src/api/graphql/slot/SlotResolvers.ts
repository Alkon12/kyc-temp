import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { SlotEntity } from '@domain/slot/SlotEntity'
import { DTO } from '@domain/kernel/DTO'
import AbstractSlotService from '@domain/slot/SlotService'
import { SlotType } from '@domain/slot/models/SlotType'
import {
  MutationConfirmSlotArgs,
  MutationPopulateSlotsArgs,
  QueryGetDatesWithFreeSlotsArgs,
  QueryGetFreeSlotsArgs,
  QueryGetSlotByIdArgs,
  QueryGetUserSlotsArgs,
} from '../app.schema.gen'
import { DateTimeValue } from '@domain/shared/DateTime'
import { UserId } from '@domain/user/models/UserId'
import moment, { Moment } from 'moment'
import momenttz from 'moment-timezone'
import ical, { ICalAttendeeRole, ICalAttendeeStatus, ICalAttendeeType, ICalCalendarMethod } from 'ical-generator'
import * as nodemailer from 'nodemailer'
import SlotRepository from '@domain/slot/SlotRepository'
import { UUID } from '@domain/shared/UUID'

@injectable()
export class SlotResolvers {
  build() {
    return {
      Query: {
        getFreeSlots: this.getFreeSlots,
        getMeetings: this.getMeetings,
        getSlots: this.getSlots,
        getDatesWithFreeSlots: this.getDatesWithFreeSlots,
        getUserSlots: this.getUserSlots,
        getSlotById: this.getSlotById,
      },
      Mutation: {
        populateSlots: this.populateSlots,
        confirmSlot: this.confirmSlot,
      },
    }
  }

  getFreeSlots = async (
    _parent: unknown,
    { slotType, dateFrom, dateTo }: QueryGetFreeSlotsArgs,
  ): Promise<DTO<SlotEntity[]>> => {
    const slotService = container.get<AbstractSlotService>(DI.SlotService)
    const slots = await slotService.getFreeSlots(
      new SlotType(slotType),
      dateFrom ? new DateTimeValue(dateFrom) : undefined,
      dateTo ? new DateTimeValue(dateTo) : undefined,
    )
    
    //return slots && slots.map((slot) => slot.toDTO())
    return slots && slots.map((slot) => ({
      ...slot.toDTO(),
      startsAt: momenttz(slot.getStartsAt()?.toDTO()).tz('America/Mexico_City').format('YYYY-MM-DDTHH:mm:ssZ'),
    }))
  }

  getMeetings = async (
    _parent: unknown,
    { slotType, dateFrom, dateTo }: QueryGetFreeSlotsArgs,
  ): Promise<DTO<SlotEntity[]>> => {
    const slotService = container.get<AbstractSlotService>(DI.SlotService)
    const slots = await slotService.getMeetings(
      new SlotType(slotType),
      dateFrom ? new DateTimeValue(dateFrom) : undefined,
      dateTo ? new DateTimeValue(dateTo) : undefined,
    )

    return slots && slots.map((slot) => slot.toDTO())
  }

  getSlots = async (
    _parent: unknown,
    { slotType, dateFrom, dateTo }: QueryGetFreeSlotsArgs,
  ): Promise<DTO<SlotEntity[]>> => {
    const slotService = container.get<AbstractSlotService>(DI.SlotService)
    const slots = await slotService.getSlots(
      new SlotType(slotType),
      dateFrom ? new DateTimeValue(dateFrom) : undefined,
      dateTo ? new DateTimeValue(dateTo) : undefined,
    )

    return slots && slots.map((slot) => slot.toDTO())
  }

  getUserSlots = async (_parent: unknown, { userId, filter }: QueryGetUserSlotsArgs): Promise<DTO<SlotEntity[]>> => {
    const slotService = container.get<AbstractSlotService>(DI.SlotService)
    const slots = await slotService.getUserSlots(new UserId(userId), {
      slotType: filter?.slotType ? new SlotType(filter.slotType) : undefined,
      dateFrom: filter?.dateFrom ? new DateTimeValue(filter.dateFrom) : undefined,
      dateTo: filter?.dateTo ? new DateTimeValue(filter.dateTo) : undefined,
    })

    //return slots && slots.map((slot) => slot.toDTO())
    return slots && slots.map((slot) => ({
      ...slot.toDTO(),      
      startsAt: momenttz(slot.getStartsAt()?.toDTO()).tz('America/Mexico_City').format('YYYY-MM-DDTHH:mm:ssZ'),
    }))
  }

  getSlotById = async (_parent: unknown, { slotId }: QueryGetSlotByIdArgs): Promise<DTO<SlotEntity>> => {
    const slotRepository = container.get<SlotRepository>(DI.SlotRepository)
    const slot = await slotRepository.getById(new UUID(slotId))

    return slot.toDTO()
  }

  getDatesWithFreeSlots = async (
    _parent: unknown,
    { slotType, dateFrom, dateTo }: QueryGetDatesWithFreeSlotsArgs,
  ): Promise<string[]> => {
    const slotService = container.get<AbstractSlotService>(DI.SlotService)
    const dates = await slotService.getDatesWithFreeSlots(
      new SlotType(slotType),
      dateFrom ? new DateTimeValue(dateFrom) : undefined,
      dateTo ? new DateTimeValue(dateTo) : undefined,
    )

    return dates.map((d) => d.toFormat('YYYY-MM-DD'))
  }

  // TODO TEMP CODE FOR TEST PURPOSES ONLY
  // TODO TEMP CODE FOR TEST PURPOSES ONLY
  // TODO TEMP CODE FOR TEST PURPOSES ONLY
  populateSlots = async (
    _parent: unknown,
    { slotType, dateFrom, dateTo }: MutationPopulateSlotsArgs,
  ): Promise<DTO<SlotEntity[]>> => {
    const slotService = container.get<AbstractSlotService>(DI.SlotService)
    const slots = await slotService.populateSlots(
      new SlotType(slotType),
      new DateTimeValue(dateFrom),
      new DateTimeValue(dateTo),
      new UserId('c387646e-4ff6-4267-b7c2-8e1283040240'),
    )

    return slots && slots.map((slot) => slot.toDTO())
  }

  // TODO TEMP CODE FOR TEST PURPOSES ONLY
  // TODO TEMP CODE FOR TEST PURPOSES ONLY
  // TODO TEMP CODE FOR TEST PURPOSES ONLY
  confirmSlot = async (_parent: unknown, { slotId }: MutationConfirmSlotArgs): Promise<DTO<SlotEntity>> => {
    console.log('confirm slot')

    var smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'rbutta@gmail.com',
        pass: 'yebp dwqy gjev zynh',
      },
    })

    const cal = ical({ name: 'my first iCal' })

    cal.method(ICalCalendarMethod.REQUEST)

    const startTime = moment()
    const endTime = moment().add(1, 'days')
    cal.createEvent({
      start: startTime,
      end: endTime,
      summary: 'Example Event',
      description: 'It works ;)',
      location: 'Mexico DF',
      url: 'http://sebbo.net/',
      organizer: {
        name: 'Rodri',
        email: 'rbutta@grupoautofin.co',
      },

      timezone: 'America/Mexico_City',
      attendees: [
        {
          email: 'my-email-address@gmail.com',
          name: 'Shashank Kumar',
          status: ICalAttendeeStatus.NEEDSACTION,
          rsvp: true,
          type: ICalAttendeeType.INDIVIDUAL,
          role: ICalAttendeeRole.REQ,
        },
        {
          email: 'mno@gmail.com',
          name: 'Mike Jack',
          status: ICalAttendeeStatus.NEEDSACTION,
          type: ICalAttendeeType.INDIVIDUAL,
          role: ICalAttendeeRole.REQ,
        },
        {
          email: 'xyz@gmail.com',
          name: 'Will Paul',
          status: ICalAttendeeStatus.NEEDSACTION,
          type: ICalAttendeeType.INDIVIDUAL,
          role: ICalAttendeeRole.REQ,
        },
      ],
    })

    var mailOptions = {
      to: 'rbutta@gmail.com',
      subject: 'This is a test email from a developer',
      html: '<h1>Welcome to my website</h1>',
      alternatives: [
        {
          contentType: 'text/calendar; charset="utf-8"; method=REQUEST',
          content: cal.toString(),
        },
      ],
      icalEvent: {
        filename: 'invitation.ics',
        method: 'request',
        content: cal.toString(),
      },
    }

    smtpTransport.sendMail(mailOptions, function (error: any, response: any) {
      if (error) {
        console.log(error)
      } else {
        console.log('Message sent: ', response)
      }
    })

    return {
      id: '1111',
      slotType: 'KYC_MEET',
      free: false,
    }
  }
}
