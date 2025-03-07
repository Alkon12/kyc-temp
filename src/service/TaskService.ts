import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { TaskEntity, TaskEntityProps } from '@domain/task/TaskEntity'
import type TaskRepository from '@domain/task/TaskRepository'
import { UUID } from '@domain/shared/UUID'
import AbstractTaskService, { TaskMoveProps } from '@domain/task/TaskService'
import { TaskFactory } from '@domain/task/TaskFactory'
import { TaskManager } from '@domain/task/TaskManager'
import { UnexpectedError, ValidationError } from '@domain/error'
import { UserId } from '@domain/user/models/UserId'
import container from '@infrastructure/inversify.config'
import { CreateTaskArgs } from '@domain/task/interfaces/CreateTaskArgs'
import { TasksByUserResponse } from '@domain/task/interfaces/TasksByUserResponse'
import type UserRepository from '@domain/user/UserRepository'
import { TaskTypeEntity } from '@domain/task/TaskTypeEntity'
import { GroupEntity } from '@domain/user/models/GroupEntity'
import { TaskType } from '@domain/task/models/TaskType'
import { GroupId } from '@domain/user/models/GroupId'
import { DTO } from '@domain/kernel/DTO'
import { BooleanValue } from '@domain/shared/BooleanValue'

@injectable()
export class TaskService implements AbstractTaskService {
  @inject(DI.TaskRepository) private readonly _taskRepository!: TaskRepository
  @inject(DI.UserRepository) private readonly _userRepository!: UserRepository

  async getById(taskId: UUID): Promise<TaskEntity | null> {
    return this._taskRepository.getById(taskId)
  }

  async getTaskGroups(taskId: UUID): Promise<GroupEntity[]> {
    const taskGroups = await this._taskRepository.getTaskGroups(taskId)

    return taskGroups ? taskGroups.map((tg) => tg.getGroup()) : []
  }

  async getTaskTypeGroups(taskTypeId: TaskType): Promise<GroupEntity[]> {
    const taskTypeGroups = await this._taskRepository.getTaskTypeGroups(taskTypeId)

    return taskTypeGroups ? taskTypeGroups.map((ttg) => ttg.getGroup()) : []
  }

  async getByUser(userId: UserId): Promise<TasksByUserResponse> {
    const user = await this._userRepository.getById(userId)

    const userAssigned: TaskEntity[] = await this._taskRepository.getByUser(userId)
    const userGroupsAssigned: TaskEntity[] = await this._taskRepository.getByGroups(
      user.getGroups().map((g) => g.getGroupId()),
    )

    return {
      userAssigned,
      userGroupsAssigned,
    }
  }

  async getUserPendingTasks(userId: UserId): Promise<TaskEntity[]> {
    const user = await this._userRepository.getById(userId)

    const userAssigned: TaskEntity[] = await this._taskRepository.getByUser(userId)
    const userGroupsAssigned: TaskEntity[] = await this._taskRepository.getByGroups(
      user.getGroups().map((g) => g.getGroupId()),
    )

    const tasks = [...userAssigned, ...userGroupsAssigned]

    const onlyPending = tasks.filter((t) => !t.isDone())

    return onlyPending
  }

  async create(props: CreateTaskArgs, assignedGroups?: GroupId[]): Promise<TaskEntity> {
    const prepareTask = TaskFactory.create(props)

    return this._taskRepository.create(prepareTask, assignedGroups)
  }

  async update(props: DTO<TaskEntityProps>): Promise<TaskEntity> {
    const task = TaskFactory.fromDTO(props)
    return this._taskRepository.save(task)
  }

  async move(props: TaskMoveProps): Promise<Boolean> {
    const task = await this._taskRepository.getById(props.taskId)
    if (!task) {
      throw new UnexpectedError('task to move not found')
    }
    if (!task.isPending()) {
      throw new ValidationError('Task is already done')
    }

    return container.get(TaskManager).dispatch({
      userId: props.userId,
      task,
      action: props.taskAction,
      metadata: props.metadata,
    })
  }

  async taskTypes(): Promise<TaskTypeEntity[]> {
    return this._taskRepository.getTaskTypes()
  }

  async getPendingByTypeAndApplication(applicationId: UUID, taskTypes: TaskType[]): Promise<TaskEntity[]> {
    const tasks: TaskEntity[] = await this._taskRepository.getByApplicationIdAndType(applicationId, taskTypes)

    const onlyPending = tasks.filter((t) => !t.isDone())

    return onlyPending
  }

  // async updateMessage(props: CreateTaskArgs, assignedGroups?: GroupId[]): Promise<Boolean> {
  //   const prepareTask = TaskFactory.create(props)

  //   try{
  //     this._taskRepository.save(prepareTask)
  //     return true
  //   } catch (error) {
  //     throw new UnexpectedError('unable to update the task')
  //   }

  // }
}
