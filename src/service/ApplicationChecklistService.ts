import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import type ApplicationRepository from '@domain/application/ApplicationRepository'
import { UUID } from '@domain/shared/UUID'
import { NotFoundError, UnexpectedError } from '@domain/error'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { ChecklistEntity } from '@domain/checklist/ChecklistEntity'
import { StringValue } from '@domain/shared/StringValue'
import { UserId } from '@domain/user/models/UserId'
import type AbstractApplicationChecklistService from '@domain/applicationChecklist/ApplicationChecklistService'
import type ApplicationChecklistRepository from '@domain/applicationChecklist/ApplicationChecklistRepository'
import { ApplicationChecklistEntity } from '@domain/applicationChecklist/ApplicationChecklistEntity'
import { type NotificationService } from '@/application/service/NotificationService'
import { StartChecklistProps } from '@domain/applicationChecklist/interfaces/StartChecklistProps'
import { ChecklistDispatchServices } from '@domain/applicationChecklist/interfaces/ChecklistDispatchServices'
import { ChecklistId } from '@domain/checklist/models/ChecklistId'
import { checklistCollection } from '@domain/checklist/ChecklistCollection'
import { CompleteChecklistProps } from '@domain/applicationChecklist/interfaces/CompleteChecklistProps'
import { DismissChecklistProps } from '@domain/applicationChecklist/interfaces/DismissChecklistProps'
import { ChecklistDependencyService } from '@domain/checklist/ChecklistDependencyService'
import { TaskAction } from '@domain/task/models/TaskAction'
import AbstractTaskService from '@domain/task/TaskService'
import AbstractProspectService from '@domain/prospect/ProspectService'
import AbstractUserService from '@domain/user/UserService'

@injectable()
export class ApplicationChecklistService implements AbstractApplicationChecklistService {
  @inject(DI.ApplicationRepository) private readonly _applicationRepository!: ApplicationRepository
  @inject(DI.ApplicationChecklistRepository)
  private readonly _applicationChecklistRepository!: ApplicationChecklistRepository
  @inject(DI.TaskService) private readonly _taskService!: AbstractTaskService
  @inject(DI.NotificationService) private _notificationService!: NotificationService
  @inject(DI.ProspectService) private readonly _prospectService!: AbstractProspectService
  @inject(DI.UserService) private readonly _userService!: AbstractUserService

  async getApplicationChecklistByApplication(applicationId: UUID): Promise<ApplicationChecklistEntity[]> {
    return this._applicationChecklistRepository.getApplicationChecklistByApplication(applicationId)
  }

  async getApplicationChecklist(
    applicationId: UUID,
    parentChecklistId?: ChecklistId,
  ): Promise<ApplicationChecklistEntity[]> {
    if (parentChecklistId) {
      const applicationChecklist =
        await this._applicationChecklistRepository.getApplicationChecklistByApplicationAndChecklistId(
          applicationId,
          parentChecklistId,
        )
      if (!applicationChecklist) {
        return []
      }

      return applicationChecklist.getChilds()
    } else {
      return this._applicationChecklistRepository.getApplicationChecklistByApplication(applicationId)
    }
  }

  async generateApplicationChecklistSchema(applicationId: UUID): Promise<BooleanValue> {
    const application = await this._applicationRepository.getById(applicationId)
    if (!application) {
      throw new UnexpectedError('Application not found when creating checklist')
    }

    const offer = application.getOffer()
    if (!offer) {
      throw new UnexpectedError('Application Offer not found when creating checklist')
    }

    const checklistIds = offer.getRequestedChecklist()
    for (const checklistId of checklistIds) {
      // sequenced instead of Promise.all
      const checklist = await this._applicationChecklistRepository.getChecklistById(checklistId)

      await this._createApplicationChecklist(application.getId(), checklist)
    }

    return new BooleanValue(true)
  }

  private async _createApplicationChecklist(
    applicationId: UUID,
    checklist: ChecklistEntity,
  ): Promise<ApplicationChecklistEntity> {
    const parentChecklistId: ChecklistId | undefined = checklist.getParentId()
    let parentApplicationChecklistId: UUID | undefined = undefined

    if (parentChecklistId) {
      let parentApplicationChecklist =
        await this._applicationChecklistRepository.getApplicationChecklistByApplicationAndChecklistId(
          applicationId,
          parentChecklistId,
        )
      if (!parentApplicationChecklist) {
        const parentChecklist = await this._applicationChecklistRepository.getChecklistById(parentChecklistId)

        parentApplicationChecklist = await this._applicationChecklistRepository.createApplicationChecklist({
          applicationId,
          checklist: parentChecklist,
        })
      }

      parentApplicationChecklistId = parentApplicationChecklist.getId()
    }

    const applicationChecklist = await this._applicationChecklistRepository.createApplicationChecklist({
      applicationId,
      checklist,
      parentApplicationChecklistId,
    })

    return applicationChecklist
  }

  async getApplicationChecklistById(applicationChecklistId: UUID): Promise<ApplicationChecklistEntity> {
    return this._applicationChecklistRepository.getApplicationChecklistById(applicationChecklistId)
  }

  async dismissApplicationChecklist(
    applicationChecklistId: UUID,
    userId: UserId,
    message?: StringValue,
  ): Promise<ApplicationChecklistEntity> {
    try {
      const applicationChecklist =
        await this._applicationChecklistRepository.getApplicationChecklistById(applicationChecklistId)

      const application = await this._applicationRepository.getById(applicationChecklist.getApplicationId())
      if (!application) {
        throw new UnexpectedError('Application not found when creating checklist')
      }

      this.dismiss({
        userId,
        applicationChecklistId,
        message,
        prospectId: application.getProspectId(),
      })

      return applicationChecklist
    } catch (error) {
      console.error('22222222 dismissApplicationChecklist error', error)
      throw error
    }
  }

  async start(props: StartChecklistProps): Promise<BooleanValue> {
    const { userId, applicationId, applicationChecklist, applicationUserId } = props

    const services: ChecklistDispatchServices = {
      taskService: this._taskService,
      notificationService: this._notificationService,
      prospectService: this._prospectService,
      userService: this._userService,
    }

    const application = await this._applicationRepository.getById(applicationId)
    if (!application) {
      throw new UnexpectedError('Application not found when creating checklist')
    }

    await this._applicationChecklistRepository.markApplicationChecklistAsStarted(applicationChecklist.getId())

    const checklistTypeConfig = checklistCollection.get(applicationChecklist.getChecklistId())

    if (checklistTypeConfig?.onStart) {
      await checklistTypeConfig?.onStart(
        {
          applicationId,
          userId,
          applicationUserId,
          applicationChecklistId: applicationChecklist.getId(),
          prospectId: application.getProspectId(),
        },
        services,
      )
    }

    return new BooleanValue(true)
  }

  async complete(props: CompleteChecklistProps, stopPropagation?: boolean): Promise<BooleanValue> {
    const { userId, applicationId, checklistId } = props

    const services: ChecklistDispatchServices = {
      taskService: this._taskService,
      notificationService: this._notificationService,
      prospectService: this._prospectService,
      userService: this._userService,
    }

    await this._applicationChecklistRepository.markChecklistItemAsComplete(applicationId, checklistId)

    const application = await this._applicationRepository.getById(applicationId)
    if (!application) {
      throw new UnexpectedError('Application not found when creating checklist')
    }

    const checklistTypeConfig = checklistCollection.get(checklistId)

    if (checklistTypeConfig?.onComplete) {
      await checklistTypeConfig?.onComplete(
        {
          applicationId,
          userId,
          prospectId: application.getProspectId(),
        },
        services,
      )
    }

    if (!stopPropagation) {
      await this.completeInheritedChecklistItems(userId, applicationId)
    }

    await this.startUnlockedChecklistItems(userId, applicationId)

    return new BooleanValue(true)
  }

  async dismiss(props: DismissChecklistProps): Promise<BooleanValue> {
    const { userId, applicationChecklistId } = props

    const services: ChecklistDispatchServices = {
      taskService: this._taskService,
      notificationService: this._notificationService,
      prospectService: this._prospectService,
      userService: this._userService,
    }

    try {
      const applicationChecklist =
        await this._applicationChecklistRepository.getApplicationChecklistById(applicationChecklistId)

      applicationChecklist.setAsDismissed(userId, props.message)

      await this._applicationChecklistRepository.saveApplicationChecklist(applicationChecklist)

      const applicationId = applicationChecklist.getApplicationId()

      const checklistTypeConfig = checklistCollection.get(applicationChecklist.getChecklistId())
      if (checklistTypeConfig?.onDismiss) {
        await checklistTypeConfig?.onDismiss(
          {
            applicationId,
            userId,
            prospectId: props.prospectId,
          },
          services,
        )
      }

      const tasks = applicationChecklist.getTasks() ?? []
      for (const task of tasks) {
        await this._taskService.move({
          userId,
          taskId: task.getId(),
          taskAction: TaskAction.DISMISS,
          metadata: {
            message: props.message,
          },
        })
      }

      await this.completeInheritedChecklistItems(userId, applicationId)

      await this.startUnlockedChecklistItems(userId, applicationId)

      return new BooleanValue(true)
    } catch (error) {
      console.error('3333333 dismissApplicationChecklist error', error)
      throw error
    }
  }

  async startUnlockedChecklistItems(userId: UserId, applicationId: UUID): Promise<BooleanValue> {
    const applicationUser = await this._applicationRepository.getApplicationUserByApplicationId(applicationId)
    if (!applicationUser) {
      throw new UnexpectedError('User of the application not found')
    }

    const application = await this._applicationRepository.getById(applicationId)
    if (!application) {
      throw new UnexpectedError('Application not found when creating checklist')
    }

    let needsRerun: boolean = true
    let runCount: number = 0

    while (needsRerun && runCount <= 10) {
      needsRerun = false
      runCount++

      let applicationChecklistItems =
        await this._applicationChecklistRepository.getApplicationChecklistByApplication(applicationId)
      const pendingItems = applicationChecklistItems.filter((q) => q.isPending())
      for (const applicationChecklist of pendingItems) {
        // sequenced instead of Promise.all
        const acDependencies = ChecklistDependencyService.dependencies(applicationChecklist.getChecklistId())

        const matchedDependencies = acDependencies.reduce((acc, it) => {
          const matched = applicationChecklistItems.find((r) => r.getChecklistId().sameValueAs(it))
          if (matched) {
            return [...acc, matched]
          }
          return acc
        }, [] as ApplicationChecklistEntity[])

        const someChildStarted =
          applicationChecklist.hasChilds() && applicationChecklist.getChilds().some((c) => c.isStarted())

        const allDependenciesCompleted =
          !applicationChecklist.hasChilds() && matchedDependencies.every((ac) => ac.isCompleted() || ac.isDismissed())

        if (allDependenciesCompleted || someChildStarted) {
          await this.start({
            userId,
            applicationId,
            applicationChecklist,
            applicationUserId: applicationUser.getId(),
            prospectId: application.getProspectId(),
          })
          needsRerun = true
        }
      }
    }

    return new BooleanValue(true)
  }

  async completeInheritedChecklistItems(userId: UserId, applicationId: UUID): Promise<BooleanValue> {
    const applicationChecklistItems =
      await this._applicationChecklistRepository.getApplicationChecklistByApplication(applicationId)

    const application = await this._applicationRepository.getById(applicationId)
    if (!application) {
      throw new UnexpectedError('Application not found when creating checklist')
    }

    const itemsWithChilds = applicationChecklistItems.filter((ac) => ac.hasChilds())
    for (const applicationChecklist of itemsWithChilds) {
      // sequenced instead of Promise.all

      const allChildsCompleted = applicationChecklist.getChilds().every((c) => c.isCompleted() || c.isDismissed())

      if (allChildsCompleted) {
        await this.complete(
          {
            userId,
            applicationId,
            checklistId: applicationChecklist.getChecklistId(),
            prospectId: application.getProspectId(),
          },
          true,
        )
      }
    }

    return new BooleanValue(true)
  }

  async getApplicationChecklistByApplicationAndChecklistId(
    applicationId: UUID,
    checklistId: ChecklistId,
  ): Promise<ApplicationChecklistEntity> {
    const applicationChecklist =
      await this._applicationChecklistRepository.getApplicationChecklistByApplicationAndChecklistId(
        applicationId,
        checklistId,
      )

    if (!applicationChecklist) {
      throw new NotFoundError(`ApplicationChecklist not found for ${applicationId.toDTO()} and ${checklistId.toDTO()}`)
    }

    return applicationChecklist
  }
}
