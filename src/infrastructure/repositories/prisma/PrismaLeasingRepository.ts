import prisma from '@client/providers/PrismaClient'
import LeasingRepository from '@domain/leasing/LeasingRepository'
import { LeasingFactory } from '@domain/leasing/LeasingFactory'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { LeasingEntity } from '@domain/leasing/LeasingEntity'
import { injectable } from 'inversify'
import { NotFoundError } from '@domain/error'
import { UUID } from '@domain/shared/UUID'

@injectable()
export class PrismaLeasingRepository implements LeasingRepository {
  async getAll(): Promise<LeasingEntity[]> {
    const leasings = await prisma.leasing.findMany({
      include: {
        user: {
          include: {
            accounts: true,
          },
        },
        vehicle: {
          include: {
            product: true,
          },
        },
      },
    })

    return leasings.map((t) => LeasingFactory.fromDTO(convertPrismaToDTO<LeasingEntity>(t)))
  }

  async getById(leasingId: UUID): Promise<LeasingEntity> {
    const leasing = await prisma.leasing.findUnique({
      where: {
        id: leasingId.toDTO(),
      },
      include: {
        user: true,
        vehicle: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!leasing) {
      throw new NotFoundError('Leasing not found')
    }

    return LeasingFactory.fromDTO(convertPrismaToDTO<LeasingEntity>(leasing))
  }

  async save(leasing: LeasingEntity): Promise<void> {
    const leasingId = leasing.props.id || new UUID();

    const leasingData = {
      id: leasingId.toDTO(),
      userId: leasing.props.userId.toDTO(),
      vehicleId: leasing.props.vehicleId.toDTO(),
      startDate: leasing.props.startDate.toDTO(),
      endDate: leasing.props.endDate.toDTO(),
      locationId: null,
      createdAt: leasing.props.createdAt?.toDTO(),
      expiredAt: leasing.props.expiredAt?.toDTO(),
    }

    await prisma.leasing.upsert({
      where: { id: leasingId.toDTO() },
      update: leasingData,
      create: leasingData,
    })
  }

  async findActiveLeasing(userId: UUID, vehicleId: UUID): Promise<LeasingEntity | null> {
    const leasing = await prisma.leasing.findFirst({
      where: {
        userId: userId.toDTO(),
        vehicleId: vehicleId.toDTO(),
        expiredAt: null,
      },
    })

    return leasing ? LeasingFactory.fromDTO(convertPrismaToDTO<LeasingEntity>(leasing)) : null
  }
}
