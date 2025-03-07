import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { StringValue } from '@domain/shared/StringValue'
import AbstractInventoryService from '@domain/inventory/InventoryService'
import { UserId } from '@domain/user/models/UserId'
import { UUID } from '@domain/shared/UUID'
import { VehicleEntity } from '@domain/vehicle/models/VehicleEntity'
import { TaskService } from './TaskService'
import { UnexpectedError, ValidationError } from '@domain/error'
import type ApplicationRepository from '@domain/application/ApplicationRepository'
import { TaskAction } from '@domain/task/models/TaskAction'
import type VehicleRepository from '@domain/vehicle/VehicleRepository'
import { VehicleFactory } from '@domain/vehicle/VehicleFactory'
import { VehicleVin } from '@domain/shared/VehicleVin'
import AbstractTaskService from '@domain/task/TaskService'

@injectable()
export class InventoryService implements AbstractInventoryService {
  @inject(DI.TaskService) private readonly _taskService!: AbstractTaskService
  @inject(DI.ApplicationRepository)
  private readonly _applicationRepository!: ApplicationRepository
  @inject(DI.VehicleRepository)
  private readonly _vehicleRepository!: VehicleRepository

  async reserveVehicle(userId: UserId, taskId: UUID, vin: VehicleVin, contractId: StringValue): Promise<VehicleEntity> {
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

    const prepareVehicle = VehicleFactory.create({
      vin,
      contractId,
      productId: application.getProductId(),
    })

    const createdVehicle = await this._vehicleRepository.create(prepareVehicle)
    application.setVehicle(createdVehicle.getId())
    await this._applicationRepository.save(application)

    //await this._taskService.move({
    //  userId,
    //  taskId,
    //  taskAction: TaskAction.ACCEPT,
    //})

    return createdVehicle
  }

  async assignTrackerDeviceToVehicle(
    userId: UserId,
    taskId: UUID,
    trackerDeviceId: StringValue,
  ): Promise<VehicleEntity> {
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

    const vehicleId = application.getVehicleId()
    if (!vehicleId) {
      throw new ValidationError('The Application doesnt have an assignated vehicle')
    }
    const vehicle = await this._vehicleRepository.getById(vehicleId)
    if (!vehicle) {
      throw new UnexpectedError('Vehicle not found')
    }

    vehicle.setTrackerDevice(trackerDeviceId)
    await this._vehicleRepository.save(vehicle)

    //await this._taskService.move({
    //  userId,
    //  taskId,
    //  taskAction: TaskAction.ACCEPT,
    //})

    return vehicle
  }

  async assignTrackerDeviceSimToVehicle(
    userId: UserId,
    taskId: UUID,
    trackerDeviceSim: StringValue,
  ): Promise<VehicleEntity> {
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

    const vehicleId = application.getVehicleId()
    if (!vehicleId) {
      throw new ValidationError('The Application doesnt have an assignated vehicle')
    }
    const vehicle = await this._vehicleRepository.getById(vehicleId)
    if (!vehicle) {
      throw new UnexpectedError('Vehicle not found')
    }

    vehicle.setTrackerDeviceSim(trackerDeviceSim)
    await this._vehicleRepository.save(vehicle)

    //await this._taskService.move({
    //  userId,
    //  taskId,
    //  taskAction: TaskAction.ACCEPT,
    //})

    return vehicle
  }
}
