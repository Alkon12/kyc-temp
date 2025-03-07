import prisma from '@client/providers/PrismaClient'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { NotFoundError } from '@domain/error'
import { UUID } from '@domain/shared/UUID'
import { VehicleEntity } from '@domain/vehicle/models/VehicleEntity'
import { VehicleFactory } from '@domain/vehicle/VehicleFactory'
import VehicleRepository from '@domain/vehicle/VehicleRepository'
import { injectable } from 'inversify'

@injectable()
export class PrismaVehicleRepository implements VehicleRepository {
  async create(vehicle: VehicleEntity): Promise<VehicleEntity> {
    const createdVehicle = await prisma.vehicle.create({
      data: {
        ...vehicle.toDTO(),
        product: undefined,
        tasks: undefined,
        leasings: undefined,
        applications: undefined,
        audit: undefined,
      },
    })

    return VehicleFactory.fromDTO(convertPrismaToDTO<VehicleEntity>(createdVehicle))
  }

  async save(vehicle: VehicleEntity): Promise<VehicleEntity> {
    const updatedVehicle = await prisma.vehicle.update({
      where: {
        id: vehicle.getId().toDTO(),
      },
      data: {
        ...vehicle.toDTO(),
        product: undefined,
        tasks: undefined,
        leasings: undefined,
        applications: undefined,
        audit: undefined,
      },
      include: {
        product: true,
      },
    })

    return VehicleFactory.fromDTO(convertPrismaToDTO<VehicleEntity>(updatedVehicle))
  }

  async getById(vehicleId: UUID): Promise<VehicleEntity> {
    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: vehicleId.toDTO(),
      },
      include: {
        product: true,
        tasks: true,
      },
    })

    if (!vehicle) {
      throw new NotFoundError('Vehicle not found')
    }

    return VehicleFactory.fromDTO(convertPrismaToDTO<VehicleEntity>(vehicle))
  }
}
