import prisma from '@client/providers/PrismaClient'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { NotFoundError } from '@domain/error'
import { DateTimeValue } from '@domain/shared/DateTime'
import { UUID } from '@domain/shared/UUID'
import { SlotEntity } from '@domain/slot/SlotEntity'
import { SlotFactory } from '@domain/slot/SlotFactory'
import SlotRepository, { SlotRepositoryCommonFilter } from '@domain/slot/SlotRepository'
import { SlotType } from '@domain/slot/models/SlotType'
import { injectable } from 'inversify'
import { UserId } from '@domain/user/models/UserId'

@injectable()
export class PrismaSlotRepository implements SlotRepository {
  async create(slot: SlotEntity): Promise<SlotEntity> {
    const createdSlot = await prisma.slot.create({
      data: {
        ...slot.toDTO(),
        hostUser: undefined,
        guestUser: undefined,
        tasks: undefined,
        prospect: undefined,
      },
    })

    return SlotFactory.fromDTO(convertPrismaToDTO<SlotEntity>(createdSlot))
  }

  async createMany(slots: SlotEntity[]): Promise<SlotEntity[]> {
    await prisma.slot.createMany({
      data: slots.map((s) => ({
        ...s.toDTO(),
        hostUser: undefined,
        guestUser: undefined,
        tasks: undefined,
        prospect: undefined,
      })),
    })

    return slots
  }

  async save(slot: SlotEntity): Promise<SlotEntity> {
    const updatedSlot = await prisma.slot.update({
      where: {
        id: slot.getId().toDTO(),
      },
      data: {
        ...slot.toDTO(),
        hostUser: undefined,
        guestUser: undefined,
        tasks: undefined,
        prospect: undefined,
      },
      include: {
        hostUser: true,
        guestUser: true,
        prospect: true,
      },
    })

    return SlotFactory.fromDTO(convertPrismaToDTO<SlotEntity>(updatedSlot))
  }

  async setAsAvailable(slotId: UUID): Promise<void> {
    const updatedSlot = await prisma.slot.update({
      where: {
        id: slotId.toDTO(),
      },
      data: {
        guestUserId: null,
        prospectId: null,
        free: true,
      },
    })

    return
  }

  async getById(slotId: UUID): Promise<SlotEntity> {
    const slot = await prisma.slot.findUnique({
      where: {
        id: slotId.toDTO(),
      },
      include: {
        hostUser: true,
        guestUser: true,
        tasks: true,
        prospect: true,
      },
    })

    if (!slot) {
      throw new NotFoundError('Slot not found')
    }

    return SlotFactory.fromDTO(convertPrismaToDTO<SlotEntity>(slot))
  }

  async getAll(): Promise<SlotEntity[]> {
    const slots = await prisma.slot.findMany({
      include: {
        hostUser: true,
        guestUser: true,
        prospect: true,
      },
      orderBy: {
        startsAt: 'asc',
      },
    })

    return slots.map((i) => SlotFactory.fromDTO(convertPrismaToDTO<SlotEntity>(i)))
  }

  async getFreeSlots(slotType?: SlotType, dateFrom?: DateTimeValue, dateTo?: DateTimeValue): Promise<SlotEntity[]> {
    const from = dateFrom?.startOfDay().toDate()
    const to = dateTo?.startOfDay().addDays(1).toDate()

    const where = {
      ...(slotType && { slotType: slotType.toDTO() }),
      free: true,
      ...(from &&
        to && {
          startsAt: {
            gte: from,
            lt: to,
          },
        }),
    }

    const slots = await prisma.slot.findMany({
      where,
      orderBy: {
        startsAt: 'asc',
      },
      include: {
        hostUser: true,
        guestUser: true,
        prospect: true,
      },
    })

    return slots.map((s) => SlotFactory.fromDTO(convertPrismaToDTO<SlotEntity>(s)))
  }

  async getMeetings(slotType?: SlotType, dateFrom?: DateTimeValue, dateTo?: DateTimeValue): Promise<SlotEntity[]> {
    const from = dateFrom?.startOfDay().toDate()
    const to = dateTo?.startOfDay().addDays(1).toDate()

    const where = {
      ...(slotType && { slotType: slotType.toDTO() }),
      free: false,
      ...(from &&
        to && {
          startsAt: {
            gte: from,
            lt: to,
          },
        }),
    }

    const slots = await prisma.slot.findMany({
      where,
      include: {
        hostUser: true,
        guestUser: true,
        prospect: {
          include: {
            prospectStatus: true,
          },
        },
      },
      orderBy: {
        startsAt: 'asc',
      },
    })

    return slots.map((s) => SlotFactory.fromDTO(convertPrismaToDTO<SlotEntity>(s)))
  }

  async getSlots(slotType?: SlotType, dateFrom?: DateTimeValue, dateTo?: DateTimeValue): Promise<SlotEntity[]> {
    const from = dateFrom?.startOfDay().toDate()
    const to = dateTo?.startOfDay().addDays(1).toDate()

    const where = {
      ...(slotType && { slotType: slotType.toDTO() }),
      ...(from &&
        to && {
          startsAt: {
            gte: from,
            lt: to,
          },
        }),
    }

    const slots = await prisma.slot.findMany({
      where,
      include: {
        hostUser: true,
        guestUser: true,
        prospect: true,
      },
      orderBy: {
        startsAt: 'asc',
      },
    })

    return slots.map((s) => SlotFactory.fromDTO(convertPrismaToDTO<SlotEntity>(s)))
  }

  async getSlotsByUser(userId: UserId, filter?: SlotRepositoryCommonFilter): Promise<SlotEntity[]> {
    const from = filter?.dateFrom?.startOfDay().toDate()
    const to = filter?.dateTo?.startOfDay().addDays(1).toDate()

    const slots = await prisma.slot.findMany({
      where: {
        OR: [
          {
            hostUserId: userId.toDTO(),
          },
          {
            guestUserId: userId.toDTO(),
          },
        ],
        ...(from && {
          startsAt: {
            gte: from,
          },
        }),
        ...(to && {
          startsAt: {
            lt: to,
          },
        }),
        ...(filter?.slotType && { slotType: filter.slotType.toDTO() }),
      },
      include: {
        hostUser: true,
        guestUser: true,
        prospect: true,
      },
      orderBy: {
        startsAt: 'asc',
      },
    })
    return slots.map((s) => SlotFactory.fromDTO(convertPrismaToDTO<SlotEntity>(s)))
  }
}
