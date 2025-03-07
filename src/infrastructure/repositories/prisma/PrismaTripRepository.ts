import prisma from '@client/providers/PrismaClient'
import TripRepository from '@/domain/trip/TripRepository'
import { TripEntity } from '@/domain/trip/TripEntity'
import { injectable } from 'inversify'
import { TripFactory } from '@domain/trip/TripFactory'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { UUID } from '@domain/shared/UUID'
import { UserId } from '@domain/user/models/UserId'
import { StringValue } from '@domain/shared/StringValue'
import { DateTimeValue } from '@domain/shared/DateTime'

@injectable()
export class PrismaTripRepository implements TripRepository {
  async create(trip: TripEntity): Promise<TripEntity> {
    const createdTrip = await prisma.trip.create({
      data: {
        ...trip.toDTO(),
        user: undefined,
      },
    })

    return TripFactory.fromDTO(convertPrismaToDTO<TripEntity>(createdTrip))
  }

  async save(trip: TripEntity): Promise<TripEntity> {
    const updatedTrip = await prisma.trip.update({
      where: {
        id: trip.getId().toDTO(),
      },
      data: {
        ...trip.toDTO(),
        user: undefined,
      },
      include: {
        user: true,
      },
    })

    return TripFactory.fromDTO(convertPrismaToDTO<TripEntity>(updatedTrip))
  }

  async getAll(): Promise<TripEntity[]> {
    const trips = await prisma.trip.findMany({
      include: {
        user: true,
      },
    })

    return trips.map((i) => TripFactory.fromDTO(convertPrismaToDTO<TripEntity>(i)))
  }

  async getById(tripId: UUID): Promise<TripEntity | null> {
    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId.toDTO(),
      },
      include: {
        user: true,
      },
    })

    if (!trip) {
      return null
    }

    return TripFactory.fromDTO(convertPrismaToDTO<TripEntity>(trip))
  }

  async getByUser(userId: UserId): Promise<TripEntity[]> {
    const trips = await prisma.trip.findMany({
      where: {
        userId: userId.toDTO(),
      },
      include: {
        user: true,
      },
    })

    return trips.map((trip) => TripFactory.fromDTO(convertPrismaToDTO<TripEntity>(trip)))
  }

  async getByDateRange(userId: UserId, from: DateTimeValue, to: DateTimeValue): Promise<TripEntity[]> {
    const dateFrom = from?.startOfDay().toDate()
    const dateTo = to?.startOfDay().addDays(1).toDate()

    const trips = await prisma.trip.findMany({
      where: {
        userId: userId.toDTO(),
        acceptedAt: {
          gte: dateFrom,
          lt: dateTo,
        },
      },
    })

    return trips.map((trip) => TripFactory.fromDTO(convertPrismaToDTO<TripEntity>(trip)))
  }
}
