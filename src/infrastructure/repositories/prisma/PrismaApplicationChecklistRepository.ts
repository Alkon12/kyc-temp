import prisma from '@client/providers/PrismaClient'
import { injectable } from 'inversify'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { UUID } from '@domain/shared/UUID'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { ChecklistId } from '@domain/checklist/models/ChecklistId'
import { ChecklistEntity } from '@domain/checklist/ChecklistEntity'
import { ChecklistFactory } from '@domain/checklist/ChecklistFactory'
import { NotFoundError } from '@domain/error'
import { UserId } from '@domain/user/models/UserId'
import { StringValue } from '@domain/shared/StringValue'
import ApplicationChecklistRepository, {
  CreateApplicationChecklistProps,
} from '@domain/applicationChecklist/ApplicationChecklistRepository'
import { ApplicationChecklistEntity } from '@domain/applicationChecklist/ApplicationChecklistEntity'
import { ApplicationChecklistFactory } from '@domain/applicationChecklist/ApplicationChecklistFactory'

@injectable()
export class PrismaApplicationChecklistRepository implements ApplicationChecklistRepository {
  async getApplicationChecklistByApplication(applicationId: UUID): Promise<ApplicationChecklistEntity[]> {
    const applicationChecklist = await prisma.applicationChecklist.findMany({
      where: {
        applicationId: applicationId.toDTO(),
      },
      include: {
        checklist: true,
        childs: {
          orderBy: {
            order: 'asc',
          },
        },
        tasks: {
          include: {
            assignedGroups: true,
            assignedUser: true,
            taskType: true,
            acceptedByUser: true,
            declinedByUser: true,
            dismissedByUser: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    })

    return applicationChecklist.map((ac) =>
      ApplicationChecklistFactory.fromDTO(convertPrismaToDTO<ApplicationChecklistEntity>(ac)),
    )
  }

  async getApplicationChecklistById(applicationChecklistId: UUID): Promise<ApplicationChecklistEntity> {
    const applicationChecklist = await prisma.applicationChecklist.findUnique({
      where: {
        id: applicationChecklistId.toDTO(),
      },
      include: {
        checklist: true,
        childs: {
          orderBy: {
            order: 'asc',
          },
        },
        tasks: {
          include: {
            assignedGroups: true,
            assignedUser: true,
            taskType: true,
            acceptedByUser: true,
            declinedByUser: true,
            dismissedByUser: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })

    if (!applicationChecklist) {
      throw new NotFoundError(`Checklist application with ID ${applicationChecklistId.toDTO()} not found`)
    }

    return ApplicationChecklistFactory.fromDTO(convertPrismaToDTO<ApplicationChecklistEntity>(applicationChecklist))
  }

  async getApplicationChecklistByApplicationAndChecklistId(
    applicationId: UUID,
    checklistId: ChecklistId,
  ): Promise<ApplicationChecklistEntity | null> {
    const applicationChecklist = await prisma.applicationChecklist.findFirst({
      where: {
        applicationId: applicationId.toDTO(),
        checklistId: checklistId.toDTO(),
      },
      include: {
        checklist: true,
        childs: {
          include: {
            // we get two levels of childs because we use the first one in the service itself. But this is not recursive
            checklist: true,
            childs: {
              include: {
                tasks: {
                  include: {
                    assignedGroups: true,
                    assignedUser: true,
                    taskType: true,
                    acceptedByUser: true,
                    declinedByUser: true,
                    dismissedByUser: true,
                  },
                  orderBy: {
                    createdAt: 'asc',
                  },
                },
              },
              orderBy: {
                order: 'asc',
              },
            },
            tasks: {
              include: {
                assignedGroups: true,
                assignedUser: true,
                taskType: true,
                acceptedByUser: true,
                declinedByUser: true,
                dismissedByUser: true,
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        tasks: {
          include: {
            assignedGroups: true,
            assignedUser: true,
            taskType: true,
            acceptedByUser: true,
            declinedByUser: true,
            dismissedByUser: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })

    if (!applicationChecklist) {
      return null
    }

    return ApplicationChecklistFactory.fromDTO(convertPrismaToDTO<ApplicationChecklistEntity>(applicationChecklist))
  }

  async markApplicationChecklistAsStarted(applicationChecklistId: UUID): Promise<BooleanValue> {
    await prisma.applicationChecklist.updateMany({
      where: {
        id: applicationChecklistId.toDTO(),
      },
      data: {
        started: true,
        startedAt: new Date(),
      },
    })

    return new BooleanValue(true)
  }

  async markApplicationChecklistAsDismissed(
    applicationChecklistId: UUID,
    userId: UserId,
    message?: StringValue,
  ): Promise<BooleanValue> {
    await prisma.applicationChecklist.updateMany({
      where: {
        id: applicationChecklistId.toDTO(),
      },
      data: {
        dismissedAt: new Date(),
        dismissedBy: userId.toDTO(),
        dismissedMessage: message ? message.toDTO() : undefined,
      },
    })

    return new BooleanValue(true)
  }

  async markChecklistItemAsComplete(applicationId: UUID, checklistId: ChecklistId): Promise<BooleanValue> {
    await prisma.applicationChecklist.updateMany({
      where: {
        applicationId: applicationId.toDTO(),
        checklistId: checklistId.toDTO(),
      },
      data: {
        completed: true,
        completedAt: new Date(),
      },
    })

    return new BooleanValue(true)
  }

  async getChecklistById(checklistId: ChecklistId): Promise<ChecklistEntity> {
    const checklist = await prisma.checklist.findUnique({
      where: {
        id: checklistId.toDTO(),
      },
    })

    if (!checklist) {
      throw new NotFoundError(`Checklist for checklist ID ${checklistId.toDTO()} not found`)
    }

    return ChecklistFactory.fromDTO(convertPrismaToDTO<ChecklistEntity>(checklist))
  }

  async createApplicationChecklist(props: CreateApplicationChecklistProps): Promise<ApplicationChecklistEntity> {
    const applicationChecklist = await prisma.applicationChecklist.create({
      data: {
        checklistId: props.checklist.getId().toDTO(),
        dismissible: props.checklist.isDismissible(), // TODO not working
        applicationId: props.applicationId.toDTO(),
        createdAt: new Date(),
        parentId: props.parentApplicationChecklistId?.toDTO(),
        order: props.order?.toDTO() || props.checklist.getOrder()?.toDTO(),
      },
    })

    return ApplicationChecklistFactory.fromDTO(convertPrismaToDTO<ApplicationChecklistEntity>(applicationChecklist))
  }

  async getDefaultChecklist(): Promise<ChecklistEntity[]> {
    const checklist = await prisma.checklist.findMany({
      where: {
        isDefault: true,
      },
    })

    if (!checklist) {
      return []
    }

    return checklist.map((c) => ChecklistFactory.fromDTO(convertPrismaToDTO<ChecklistEntity>(c)))
  }

  async saveApplicationChecklist(
    applicationChecklist: ApplicationChecklistEntity,
  ): Promise<ApplicationChecklistEntity> {
    const updatedApplicationChecklist = await prisma.applicationChecklist.update({
      where: {
        id: applicationChecklist.getId().toDTO(),
      },
      data: {
        ...applicationChecklist.toDTO(),
        dismissedByUser: undefined,
        application: undefined,
        checklist: undefined,
        tasks: undefined,
        parent: undefined,
        childs: undefined,
      },
      include: {
        checklist: true,
        tasks: undefined,
      },
    })

    return ApplicationChecklistFactory.fromDTO(
      convertPrismaToDTO<ApplicationChecklistEntity>(updatedApplicationChecklist),
    )
  }
}
