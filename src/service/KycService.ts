import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { OverviewCount } from '@domain/shared/OverviewCount'
import type ApplicationRepository from '@domain/application/ApplicationRepository'
import { ApplicationEntity } from '@domain/application/ApplicationEntity'
import AbstractKycService from '@domain/kyc/KycService'
import {
  KycApplicationsByActivity,
  KycApplicationsByProgress,
  KycOverviewResponse,
} from '@domain/kyc/interfaces/KycOverviewResponse'
import { AddressEntity } from '@domain/address/AddressEntity'
import { UnexpectedError, ValidationError } from '@domain/error'
import type AddressRepository from '@domain/address/AddressRepository'
import { UUID } from '@domain/shared/UUID'
import { TaskService } from './TaskService'
import { UserId } from '@domain/user/models/UserId'
import { TaskAction } from '@domain/task/models/TaskAction'
import { StringValue } from '@domain/shared/StringValue'
import AbstractTaskService from '@domain/task/TaskService'

@injectable()
export class KycService implements AbstractKycService {
  @inject(DI.ApplicationRepository)
  private readonly _applicationRepository!: ApplicationRepository
  @inject(DI.AddressRepository)
  private readonly _addressRepository!: AddressRepository
  @inject(DI.TaskService) private readonly _taskService!: AbstractTaskService

  async overview(): Promise<KycOverviewResponse> {
    const applications = await this._applicationRepository.getAll()

    return {
      byProgress: this._getByProgressCount(applications),
      byActivity: this._getByActivity(applications),
    }
  }

  _getByProgressCount = (applications: ApplicationEntity[]): KycApplicationsByProgress => {
    const kycComplete = applications.filter((l) => l.hasKycFinished()).length
    const kycDriverEngaged = applications.filter((l) => l.hasDriverEngaged()).length
    const deliveryProcess = applications.length - kycComplete - kycDriverEngaged

    return {
      kycDriverEngaged,
      kycComplete,
      deliveryProcess,
    }
  }

  _getByActivity = (applications: ApplicationEntity[]): KycApplicationsByActivity => {
    // const recent = applications.filter(l => l.isRecent()).length
    // const active = applications.filter(l => l.isActive()).length
    // const expired = applications.filter(l => l.isExpired()).length

    return {
      onTime: new OverviewCount(0).toDTO(),
      delayedByDriver: new OverviewCount(0).toDTO(),
      delayedByBackoffice: new OverviewCount(0).toDTO(),
      delayedByManager: new OverviewCount(0).toDTO(),
    }
  }

  async setKycAddress(userId: UserId, taskId: UUID, address: AddressEntity): Promise<AddressEntity> {
    const task = await this._taskService.getById(taskId)
    if (!task) {
      throw new ValidationError('Task not found')
    }
    if (!task.isPending()) {
      throw new ValidationError('Task is already closed')
    }

    const applicationId = task.getApplicationId()
    if (!applicationId) {
      throw new ValidationError('Application for Task not found')
    }

    const application = await this._applicationRepository.getById(applicationId)
    if (!application) {
      throw new UnexpectedError('Problem fetching the application')
    }

    const createdAddress = await this._addressRepository.create(address)
    application.setAddress(createdAddress.getId())
    await this._applicationRepository.save(application)

    await this._taskService.move({
      userId,
      taskId,
      taskAction: TaskAction.ACCEPT,
    })

    return createdAddress
  }

  async setInactivityStatement(userId: UserId, taskId: UUID, reason: StringValue): Promise<Boolean> {
    const task = await this._taskService.getById(taskId)
    if (!task) {
      throw new ValidationError('Task not found')
    }
    if (!task.isPending()) {
      throw new ValidationError('Task is already closed')
    }

    const applicationId = task.getApplicationId()
    if (!applicationId) {
      throw new ValidationError('Application for Task not found')
    }

    const application = await this._applicationRepository.getById(applicationId)
    if (!application) {
      throw new UnexpectedError('Problem fetching the application')
    }

    application.setInactivityStatementReason(reason)
    await this._applicationRepository.save(application)

    await this._taskService.move({
      userId,
      taskId,
      taskAction: TaskAction.ACCEPT,
    })

    return true
  }
}
