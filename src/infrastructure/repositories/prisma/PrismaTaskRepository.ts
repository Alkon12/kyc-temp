import prisma from '@client/providers/PrismaClient'
import TaskRepository from '@domain/task/TaskRepository'
import { TaskFactory } from '@domain/task/TaskFactory'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { TaskEntity } from '@domain/task/TaskEntity'
import { injectable } from 'inversify'
import { UUID } from '@domain/shared/UUID'
import { NotFoundError } from '@domain/error'
import { UserId } from '@domain/user/models/UserId'
import { GroupId } from '@domain/user/models/GroupId'
import { TaskType } from '@domain/task/models/TaskType'
import { TaskTypeFactory } from '@domain/task/TaskTypeFactory'
import { TaskTypeEntity } from '@domain/task/TaskTypeEntity'
import { TaskGroupFactory } from '@domain/task/TaskGroupFactory'
import { TaskGroupEntity } from '@domain/task/TaskGroupEntity'
import { TaskTypeGroupFactory } from '@domain/task/TaskTypeGroupFactory'
import { TaskTypeGroupEntity } from '@domain/task/TaskTypeGroupEntity'

@injectable()
export class PrismaTaskRepository implements TaskRepository {
  async create(task: TaskEntity, assignedGroups?: GroupId[]): Promise<TaskEntity> {
    const createdTask = await prisma.task.create({
      data: {
        ...task.toDTO(),
        lead: undefined,
        assignedUser: undefined,
        offer: undefined,
        quote: undefined,
        application: undefined,
        leasing: undefined,
        vehicle: undefined,
        product: undefined,
        assignedGroups: undefined,
        taskType: undefined,
        applicationChecklist: undefined,
        acceptedByUser: undefined,
        declinedByUser: undefined,
        dismissedByUser: undefined,
        slot: undefined,
        originTask: undefined,
        originatedTasks: undefined,
      },
    })

    if (assignedGroups) {
      await Promise.all(
        assignedGroups.map(async (ag) => {
          await prisma.taskGroup.create({
            data: {
              groupId: ag.toDTO(),
              taskId: createdTask.id,
              assignedAt: new Date(),
            },
          })
        }),
      )
    }

    return TaskFactory.fromDTO(convertPrismaToDTO<TaskEntity>(createdTask))
  }

  async getById(taskId: UUID): Promise<TaskEntity | null> {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId.toDTO(),
      },
      include: {
        lead: true,
        assignedUser: true,
        offer: true,
        quote: true,
        application: {
          include: {
            quote: true,
            user: true,
          },
        },
        leasing: true,
        vehicle: true,
        product: true,
        assignedGroups: {
          include: {
            group: true,
          },
        },
        originTask: true,
      },
    })

    if (!task) {
      throw new NotFoundError(`Task ${taskId.toDTO()} not found`)
    }

    return TaskFactory.fromDTO(convertPrismaToDTO<TaskEntity>(task))
  }

  async getByUser(userId: UserId): Promise<TaskEntity[]> {
    const tasks = await prisma.task.findMany({
      where: {
        assignedUserId: userId.toDTO(),
      },
      include: {
        lead: true,
        assignedUser: true,
        offer: true,
        quote: true,
        applicationChecklist: {
          include: {
            checklist: true,
          },
        },
        application: {
          include: {
            quote: true,
            user: true,
          },
        },
        leasing: true,
        taskType: true,
        vehicle: true,
        product: true,
        assignedGroups: {
          include: {
            group: true,
          },
        },
        originTask: true,
      },
    })

    return tasks.map((t) => TaskFactory.fromDTO(convertPrismaToDTO<TaskEntity>(t)))
  }

  async getByGroups(groups: GroupId[]): Promise<TaskEntity[]> {
    const taskGroups = await prisma.taskGroup.findMany({
      where: {
        groupId: {
          in: groups.map((g) => g.toDTO()),
        },
      },
      include: {
        task: {
          include: {
            taskType: true,
            lead: true,
            assignedUser: true,
            offer: true,
            quote: true,
            applicationChecklist: {
              include: {
                checklist: true,
              },
            },
            application: {
              include: {
                quote: true,
                user: true,
              },
            },
            leasing: true,
            vehicle: true,
            product: true,
            assignedGroups: {
              include: {
                group: true,
              },
            },
            originTask: true,
          },
        },
      },
    })

    const tasks = taskGroups.map((tg) => tg.task)

    return tasks.map((t) => TaskFactory.fromDTO(convertPrismaToDTO<TaskEntity>(t)))
  }

  async getByApplicationIdAndType(applicationId: UUID, taskTypes: TaskType[]): Promise<TaskEntity[]> {
    const tasks = await prisma.task.findMany({
      where: {
        applicationId: applicationId.toDTO(),
        taskTypeId: {
          in: taskTypes.map((tt) => tt.toDTO()),
        },
      },
      include: {
        taskType: true,
        originTask: true,
      },
    })

    return tasks.map((t) => TaskFactory.fromDTO(convertPrismaToDTO<TaskEntity>(t)))
  }

  async save(task: TaskEntity): Promise<TaskEntity> {
    const updatedTask = await prisma.task.update({
      where: {
        id: task.getId().toDTO(),
      },
      data: {
        ...task.toDTO(),
        lead: undefined,
        assignedUser: undefined,
        offer: undefined,
        quote: undefined,
        application: undefined,
        leasing: undefined,
        vehicle: undefined,
        product: undefined,
        assignedGroups: undefined,
        taskType: undefined,
        applicationChecklist: undefined,
        acceptedByUser: undefined,
        declinedByUser: undefined,
        dismissedByUser: undefined,
        slot: undefined,
        originTask: undefined,
        originatedTasks: undefined,
      },
    })

    return TaskFactory.fromDTO(convertPrismaToDTO<TaskEntity>(updatedTask))
  }

  async getTaskTypes(): Promise<TaskTypeEntity[]> {
    const taskTypes = await prisma.taskType.findMany({
      include: {
        assignedGroups: {
          include: {
            group: true,
          },
        },
      },
    })

    return taskTypes.map((t) => TaskTypeFactory.fromDTO(convertPrismaToDTO<TaskTypeEntity>(t)))
  }

  async getTaskGroups(taskId: UUID): Promise<TaskGroupEntity[]> {
    const taskGroups = await prisma.taskGroup.findMany({
      where: {
        taskId: taskId.toDTO(),
      },
      include: {
        group: true,
        task: true,
      },
    })

    if (!taskGroups) {
      return []
    }

    return taskGroups.map((t) => TaskGroupFactory.fromDTO(convertPrismaToDTO<TaskGroupEntity>(t)))
  }

  async getTaskTypeGroups(taskTypeId: TaskType): Promise<TaskTypeGroupEntity[]> {
    const taskTypeGroups = await prisma.taskTypeGroup.findMany({
      where: {
        taskTypeId: taskTypeId.toDTO(),
      },
      include: {
        group: true,
        taskType: true,
      },
    })

    if (!taskTypeGroups) {
      return []
    }

    return taskTypeGroups.map((tg) => TaskTypeGroupFactory.fromDTO(convertPrismaToDTO<TaskTypeGroupEntity>(tg)))
  }
}
