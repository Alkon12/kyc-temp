import prisma from '@client/providers/PrismaClient'
import ApplicationRepository from '@/domain/application/ApplicationRepository'
import { ApplicationEntity } from '@/domain/application/ApplicationEntity'
import { injectable } from 'inversify'
import { ApplicationFactory } from '@domain/application/ApplicationFactory'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { UUID } from '@domain/shared/UUID'
import { UserEntity } from '@domain/user/models/UserEntity'
import { UserFactory } from '@domain/user/UserFactory'
import { NotFoundError } from '@domain/error'
import { UserId } from '@domain/user/models/UserId'

@injectable()
export class PrismaApplicationRepository implements ApplicationRepository {
  async create(application: ApplicationEntity): Promise<ApplicationEntity> {
    const createdApplication = await prisma.application.create({
      data: {
        ...application.toDTO(),
        user: undefined,
        offer: undefined,
        product: undefined,
        vehicle: undefined,
        quote: undefined,
        tasks: undefined,
        address: undefined,
        checklist: undefined,
        prospect: undefined,
      },
    })

    return ApplicationFactory.fromDTO(convertPrismaToDTO<ApplicationEntity>(createdApplication))
  }

  async save(application: ApplicationEntity): Promise<ApplicationEntity> {
    const data = {
      ...application.toDTO(),
      user: undefined,
      offer: undefined,
      product: undefined,
      vehicle: undefined,
      quote: undefined,
      tasks: undefined,
      address: undefined,
      checklist: undefined,
      prospect: undefined,
    }

    console.log('data', data)

    const updatedApplication = await prisma.application.update({
      where: {
        id: application.getId().toDTO(),
      },
      data,
    })

    return ApplicationFactory.fromDTO(convertPrismaToDTO<ApplicationEntity>(updatedApplication))
  }

  // TODO make more generic
  async clearVehicle(applicationId: UUID): Promise<ApplicationEntity> {
    const updatedApplication = await prisma.application.update({
      where: {
        id: applicationId.toDTO(),
      },
      data: {
        vehicleId: null,
      },
    })

    return ApplicationFactory.fromDTO(convertPrismaToDTO<ApplicationEntity>(updatedApplication))
  }

  async getById(applicationId: UUID): Promise<ApplicationEntity> {
    const application = await prisma.application.findUnique({
      where: {
        id: applicationId.toDTO(),
      },
      include: {
        user: true,
        offer: true,
        product: true,
        vehicle: true,
        quote: true,
        address: true,
        tasks: {
          include: {
            taskType: true,
          },
        },
        checklist: {
          include: {
            checklist: {
              include: {
                parent: true,
              },
            },
            tasks: {
              include: {
                taskType: {
                  include: {
                    assignedGroups: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!application) {
      throw new NotFoundError('Application not found')
    }

    return ApplicationFactory.fromDTO(convertPrismaToDTO<ApplicationEntity>(application))
  }

  async getAll(): Promise<ApplicationEntity[]> {
    const applications = await prisma.application.findMany({
      include: {
        user: true,
        product: true,
      },
    })

    return applications.map((i) => ApplicationFactory.fromDTO(convertPrismaToDTO<ApplicationEntity>(i)))
  }

  async getByUser(userId: UserId): Promise<ApplicationEntity[]> {
    const applications = await prisma.application.findMany({
      where: {
        userId: userId.toDTO(),
      },
    })

    return applications.map((i) => ApplicationFactory.fromDTO(convertPrismaToDTO<ApplicationEntity>(i)))
  }

  async getApplicationUserByApplicationId(applicationId: UUID): Promise<UserEntity | null> {
    const application = await prisma.application.findUnique({
      where: {
        id: applicationId.toDTO(),
      },
      include: {
        user: true,
      },
    })

    if (!application) {
      return null
    }

    return UserFactory.fromDTO(convertPrismaToDTO<UserEntity>(application.user))
  }
}
