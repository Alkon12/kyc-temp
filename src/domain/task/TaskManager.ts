import { inject, injectable } from 'inversify'
import { TaskAction } from './models/TaskAction'
import { taskTypeCollection } from './TaskTypeCollection'
import { ValidationError } from '@domain/error'
import { TaskDispatchArgs } from './interfaces/TaskDispatchArgs'
import type TaskRepository from './TaskRepository'
import { DI } from '@infrastructure'
import { type NotificationService } from '@/application/service/NotificationService'
import { DispatchValidationError } from './models/DispatchValidationError'
import { TaskDispatchServices } from './interfaces/TaskDispatchServices'
import { ContentKey } from '@domain/content/ContentKey'
import { ApplicationChecklistService } from '@service/ApplicationChecklistService'
import { TaskMetadata } from './interfaces/TaskMetadata'
import AbstractTaskService from './TaskService'
import type LeasingRepository from '@domain/leasing/LeasingRepository'
import AbstractProspectService from '@domain/prospect/ProspectService'
import AbstractSlotService from '@domain/slot/SlotService'
import { PrismaClient } from '@prisma/client'
import AbstractContractService from '@domain/contract/AbstractContractService'

export type TaskTypeConfig = {
  validation?: (args: TaskDispatchArgs, services: TaskDispatchServices) => DispatchValidationError | null
  accept?: (args: TaskDispatchArgs, services: TaskDispatchServices) => Promise<boolean>
  decline?: (args: TaskDispatchArgs, services: TaskDispatchServices) => Promise<boolean>
  dismiss?: (args: TaskDispatchArgs, services: TaskDispatchServices) => Promise<boolean>
}

@injectable()
export class TaskManager {
  @inject(DI.TaskRepository) private readonly _taskRepository!: TaskRepository
  @inject(DI.TaskService) private readonly _taskService!: AbstractTaskService
  @inject(DI.NotificationService)
  private _notificationService!: NotificationService
  @inject(DI.ApplicationChecklistService)
  private _applicationChecklistService!: ApplicationChecklistService
  @inject(DI.LeasingRepository)
  private _leasingRepository!: LeasingRepository
  @inject(DI.ProspectService)
  private _prospectService!: AbstractProspectService
  @inject(DI.SlotService)
  private _slotService!: AbstractSlotService
  @inject(DI.ContractService)
  private _contractService!: AbstractContractService

  async dispatch(args: TaskDispatchArgs): Promise<boolean> {
    const { task, action, userId, metadata } = args
    const taskTypes = taskTypeCollection.get(task.getTaskTypeId())
    const prisma = new PrismaClient()

    const services: TaskDispatchServices = {
      prisma,
      taskService: this._taskService,
      notificationService: this._notificationService,
      applicationChecklistService: this._applicationChecklistService,
      leasingRepository: this._leasingRepository,
      prospectService: this._prospectService,
      slotService: this._slotService,
      contractService: this._contractService,
    }

    if (taskTypes?.validation) {
      const validationError = taskTypes.validation(args, services)
      if (validationError) {
        throw new ValidationError(`Task validation fail: ${validationError?.toDTO()}`)
      }
    }

    if (action.sameValueAs(TaskAction.ACCEPT)) {
      task.setAsAccepted(userId, metadata?.message)

      if (taskTypes?.accept) {
        await taskTypes?.accept(args, services)
      }

      await this._taskRepository.save(task)
    } else if (action.sameValueAs(TaskAction.DECLINE)) {
      task.setAsDeclined(userId, metadata?.message)

      if (taskTypes?.decline) {
        await taskTypes?.decline(args, services)
      }

      await this._taskRepository.save(task)
    } else if (action.sameValueAs(TaskAction.DISMISS)) {
      task.setAsDismissed(userId, metadata?.message)

      if (taskTypes?.dismiss) {
        await taskTypes?.dismiss(args, services)
      }

      await this._taskRepository.save(task)
    }

    return true
  }

  static getContentKeyFromTaskMetadata(metadata?: TaskMetadata): ContentKey | null {
    if (!metadata) {
      return null
    }

    const contentProvider = metadata.contentProvider
    const contentStorageKey = metadata.contentStorageKey
    if (!contentStorageKey || !contentProvider) {
      return null
    }

    return ContentKey.build(contentProvider, contentStorageKey)
  }
}
