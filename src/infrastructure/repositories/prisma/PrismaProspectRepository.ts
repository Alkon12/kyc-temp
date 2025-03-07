import prisma from '@client/providers/PrismaClient'
import { ProspectEntity } from '@/domain/prospect/ProspectEntity'
import { injectable } from 'inversify'
import { ProspectFactory } from '@domain/prospect/ProspectFactory'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { UUID } from '@domain/shared/UUID'
import { UserId } from '@domain/user/models/UserId'
import ProspectRepository, { ProspectRepositoryGetAllFilters } from '@domain/prospect/ProspectRepository'
import { ProspectActivityEntity } from '@domain/prospect/ProspectActivityEntity'
import { ProspectActivityFactory } from '@domain/prospect/ProspectActivityFactory'
import { ProspectStatusEntity } from '@domain/prospect/ProspectStatusEntity'
import { ProspectStatusFactory } from '@domain/prospect/ProspectStatusFactory'

@injectable()
export class PrismaProspectRepository implements ProspectRepository {
  async create(prospect: ProspectEntity): Promise<ProspectEntity> {
    const createdProspect = await prisma.prospect.create({
      data: {
        ...prospect.toDTO(),
        user: undefined,
        activity: undefined,
        prospectStatus: undefined,
        quotes: undefined,
        applications: undefined,
        supportUser: undefined,
        activeApplication: undefined,
        lastActivityUser: undefined,
        invitations: undefined,
      },
    })

    return ProspectFactory.fromDTO(convertPrismaToDTO<ProspectEntity>(createdProspect))
  }

  async save(prospect: ProspectEntity): Promise<ProspectEntity> {
    const updatedProspect = await prisma.prospect.update({
      where: {
        id: prospect.getId().toDTO(),
      },
      data: {
        ...prospect.toDTO(),
        user: undefined,
        activity: undefined,
        prospectStatus: undefined,
        quotes: undefined,
        applications: undefined,
        supportUser: undefined,
        activeApplication: undefined,
        lastActivityUser: undefined,
        invitations: undefined,
      },
      include: {
        user: true,
        prospectStatus: true,
        supportUser: true,
        activeApplication: true,
        lastActivityUser: true,
        quotes: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            offers: {
              include: {
                product: true,
              },
            },
          },
        },
        applications: true,
        activity: {
          include: {
            prospectActivityType: true,
            createdByUser: true,
            prospectStatus: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    return ProspectFactory.fromDTO(convertPrismaToDTO<ProspectEntity>(updatedProspect))
  }

  async getAll(filters?: ProspectRepositoryGetAllFilters): Promise<ProspectEntity[]> {
    const prospects = await prisma.prospect.findMany({
      where: {
        ...(filters?.prospectStatusId &&
          filters.prospectStatusId.length > 0 && {
            prospectStatusId: {
              in: filters.prospectStatusId.map((id) => id.toDTO()),
            },
          }),
        ...(filters?.supportUserId &&
          filters.supportUserId.length > 0 && {
            supportUserId: {
              in: filters.supportUserId.map((id) => id.toDTO()),
            },
          }),
        ...(!!filters?.withApplication && {
          applications: {
            some: {},
          },
        }),
        ...(!!filters?.withQuotes && {
          quotes: {
            some: {},
          },
        }),
        ...(!!filters?.withoutAssignedSupportUser && {
          supportUserId: null,
        }),
        ...(filters?.search && {
          OR: [
            {
              friendlyId: {
                contains: filters.search.toDTO(),
                mode: 'insensitive',
              },
            },
            {
              id: {
                contains: filters.search.toDTO(),
                mode: 'insensitive',
              },
            },
            {
              user: {
                email: {
                  contains: filters.search.toDTO(),
                  mode: 'insensitive',
                },
              },
            },
            {
              user: {
                firstName: {
                  contains: filters.search.toDTO(),
                  mode: 'insensitive',
                },
              },
            },
            {
              user: {
                lastName: {
                  contains: filters.search.toDTO(),
                  mode: 'insensitive',
                },
              },
            },
            {
              activeApplication: {
                contractId: {
                  contains: filters.search.toDTO(),
                  mode: 'insensitive',
                },
              },
            },
          ],
        }),
        ...(filters?.updatedBefore && {
          lastActivityAt: {
            lte: filters.updatedBefore.toDTO(),
          },
        }),
      },
      include: {
        user: true,
        prospectStatus: true,
        supportUser: true,
        activeApplication: true,
        lastActivityUser: true,
        quotes: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        applications: true,
      },
      orderBy: {
        lastActivityAt: 'desc',
      },
    })

    return prospects.map((i) => ProspectFactory.fromDTO(convertPrismaToDTO<ProspectEntity>(i)))
  }

  async getById(prospectId: UUID): Promise<ProspectEntity | null> {
    const prospect = await prisma.prospect.findUnique({
      where: {
        id: prospectId.toDTO(),
      },
      include: {
        user: true,
        prospectStatus: true,
        supportUser: true,
        activeApplication: {
          include: {
            product: true,
            offer: true,
          },
        },
        lastActivityUser: true,
        quotes: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            offers: {
              include: {
                product: true,
              },
            },
          },
        },
        applications: true,
        activity: {
          include: {
            prospectActivityType: true,
            createdByUser: true,
            prospectStatus: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!prospect) {
      return null
    }

    return ProspectFactory.fromDTO(convertPrismaToDTO<ProspectEntity>(prospect))
  }

  async getByUser(userId: UserId): Promise<ProspectEntity | null> {
    const prospect = await prisma.prospect.findFirst({
      where: {
        userId: userId.toDTO(),
      },
      include: {
        user: true,
        prospectStatus: true,
        supportUser: true,
        activeApplication: {
          include: {
            product: true,
            offer: true,
          },
        },
        lastActivityUser: true,
        quotes: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            offers: {
              include: {
                product: true,
              },
            },
          },
        },
        applications: true,
        activity: {
          include: {
            prospectActivityType: true,
            createdByUser: true,
            prospectStatus: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!prospect) {
      return null
    }

    return ProspectFactory.fromDTO(convertPrismaToDTO<ProspectEntity>(prospect))
  }

  async getActivity(prospectId: UUID): Promise<ProspectActivityEntity[]> {
    const activity = await prisma.prospectActivity.findMany({
      where: {
        prospectId: prospectId.toDTO(),
      },
      include: {
        prospectActivityType: true,
        createdByUser: true,
        prospectStatus: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return activity.map((i) => ProspectActivityFactory.fromDTO(convertPrismaToDTO<ProspectActivityEntity>(i)))
  }

  async getProspectStatusList(): Promise<ProspectStatusEntity[]> {
    const statusList = await prisma.prospectStatus.findMany({
      orderBy: {
        order: 'asc',
      },
    })

    return statusList.map((i) => ProspectStatusFactory.fromDTO(convertPrismaToDTO<ProspectStatusEntity>(i)))
  }
}
