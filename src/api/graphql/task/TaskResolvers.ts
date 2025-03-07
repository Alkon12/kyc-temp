import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { TaskEntity } from '@domain/task/TaskEntity'
import { DTO } from '@domain/kernel/DTO'
import { GroupEntity } from '@domain/user/models/GroupEntity'
import { MutationMoveTaskArgs, QueryTaskByIdArgs } from '../app.schema.gen'
import AbstractTaskService from '@domain/task/TaskService'
import { ApiContext } from '@api/shared/Api'
import { TaskType } from '@domain/task/models/TaskType'
import { TaskTypeEntity } from '@domain/task/TaskTypeEntity'
import { UUID } from '@domain/shared/UUID'
import { TaskAction } from '@domain/task/models/TaskAction'
import { StringValue } from '@domain/shared/StringValue'
import { NumberValue } from '@domain/shared/NumberValue'

@injectable()
export class TaskResolvers {
  build() {
    return {
      Query: {
        taskById: this.taskById,
        taskTypes: this.taskTypes,
      },
      Mutation: {
        moveTask: this.moveTask,
      },
      Task: {
        assignedGroups: this.taskAssignedGroups,
      },
      TaskType: {
        assignedGroups: this.taskTypeAssignedGroups,
      },
    }
  }

  taskTypes = async (): Promise<DTO<TaskTypeEntity[]>> => {
    const taskService = container.get<AbstractTaskService>(DI.TaskService)
    const taskTypes = await taskService.taskTypes()

    return taskTypes && taskTypes.map((t) => t.toDTO())
  }

  taskById = async (_parent: unknown, { taskId }: QueryTaskByIdArgs): Promise<DTO<TaskEntity | null>> => {
    const taskService = container.get<AbstractTaskService>(DI.TaskService)
    const task = await taskService.getById(new UUID(taskId))

    return task && task.toDTO()
  }

  moveTask = async (
    _parent: unknown,
    { taskId, taskAction, metadata }: MutationMoveTaskArgs,
    context: ApiContext,
  ): Promise<Boolean> => {
    const taskService = container.get<AbstractTaskService>(DI.TaskService)

    return taskService.move({
      userId: context.userId,
      taskId: new UUID(taskId),
      taskAction: new TaskAction(taskAction),
      metadata: {
        message: metadata?.message ? new StringValue(metadata.message) : undefined,
        slotId: metadata?.slotId ? new UUID(metadata.slotId) : undefined,
        referencia: metadata?.referencia ? new StringValue(metadata.referencia) : undefined,
        idcliente: metadata?.idcliente ? new NumberValue(metadata.idcliente) : undefined
      },
    })
  }

  taskAssignedGroups = async (parent: DTO<TaskEntity>): Promise<DTO<GroupEntity[]>> => {
    const taskService = container.get<AbstractTaskService>(DI.TaskService)
    const groups = await taskService.getTaskGroups(new UUID(parent.id))

    return groups && groups.map((g) => g.toDTO())
  }

  taskTypeAssignedGroups = async (parent: DTO<TaskTypeEntity>): Promise<DTO<GroupEntity[]>> => {
    const taskService = container.get<AbstractTaskService>(DI.TaskService)
    const groups = await taskService.getTaskTypeGroups(new TaskType(parent.id))

    return groups && groups.map((g) => g.toDTO())
  }
}
