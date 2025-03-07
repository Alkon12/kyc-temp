import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import { MutationDismissApplicationChecklistArgs, QueryApplicationChecklistArgs } from '../app.schema.gen'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { UUID } from '@domain/shared/UUID'
import { ChecklistId } from '@domain/checklist/models/ChecklistId'
import { StringValue } from '@domain/shared/StringValue'
import { ApiContext } from '@api/shared/Api'
import { ApplicationChecklistEntity } from '@domain/applicationChecklist/ApplicationChecklistEntity'
import { ApplicationChecklistFactory } from '@domain/applicationChecklist/ApplicationChecklistFactory'
import AbstractApplicationChecklistService from '@domain/applicationChecklist/ApplicationChecklistService'
import { TaskEntity } from '@domain/task/TaskEntity'

@injectable()
export class ApplicationChecklistResolvers {
  build() {
    return {
      Query: {
        applicationChecklist: this.applicationChecklist,
      },
      Mutation: {
        dismissApplicationChecklist: this.dismissApplicationChecklist,
      },
      ApplicationChecklist: {
        isActive: this.applicationChecklistIsActive,
        isPending: this.applicationChecklistIsPending,
        isStarted: this.applicationChecklistIsStarted,
        isCompleted: this.applicationChecklistIsCompleted,
        isDismissed: this.applicationChecklistIsDismissed,
        fullTasks: this.applicationChecklistFullTasks,
      },
    }
  }

  applicationChecklist = async (
    _parent: unknown,
    { applicationId, parentChecklistId }: QueryApplicationChecklistArgs,
  ): Promise<DTO<ApplicationChecklistEntity[]>> => {
    const applicationChecklistService = container.get<AbstractApplicationChecklistService>(
      DI.ApplicationChecklistService,
    )
    const parentChecklistIdProp = parentChecklistId ? new ChecklistId(parentChecklistId) : undefined
    const applicationChecklist = await applicationChecklistService.getApplicationChecklist(
      new UUID(applicationId),
      parentChecklistIdProp,
    )

    return applicationChecklist.map((ac) => ac.toDTO())
  }

  applicationChecklistIsActive = async (
    parent: DTO<ApplicationChecklistEntity>,
    _: unknown,
  ): Promise<DTO<BooleanValue>> => {
    const applicationChecklist = ApplicationChecklistFactory.fromDTO(parent)
    return applicationChecklist.isActive()
  }

  applicationChecklistIsPending = async (
    parent: DTO<ApplicationChecklistEntity>,
    _: unknown,
  ): Promise<DTO<BooleanValue>> => {
    const applicationChecklist = ApplicationChecklistFactory.fromDTO(parent)
    return applicationChecklist.isPending()
  }

  applicationChecklistIsStarted = async (
    parent: DTO<ApplicationChecklistEntity>,
    _: unknown,
  ): Promise<DTO<BooleanValue>> => {
    const applicationChecklist = ApplicationChecklistFactory.fromDTO(parent)
    return applicationChecklist.isStarted()
  }

  applicationChecklistIsCompleted = async (
    parent: DTO<ApplicationChecklistEntity>,
    _: unknown,
  ): Promise<DTO<BooleanValue>> => {
    const applicationChecklist = ApplicationChecklistFactory.fromDTO(parent)
    return applicationChecklist.isCompleted()
  }

  applicationChecklistIsDismissed = async (
    parent: DTO<ApplicationChecklistEntity>,
    _: unknown,
  ): Promise<DTO<BooleanValue>> => {
    const applicationChecklist = ApplicationChecklistFactory.fromDTO(parent)
    return applicationChecklist.isDismissed()
  }

  dismissApplicationChecklist = async (
    _parent: unknown,
    { applicationChecklistId, message }: MutationDismissApplicationChecklistArgs,
    context: ApiContext,
  ): Promise<DTO<ApplicationChecklistEntity>> => {
    const applicationChecklistService = container.get<AbstractApplicationChecklistService>(
      DI.ApplicationChecklistService,
    )

    try {
      const applicationChecklist = await applicationChecklistService.dismissApplicationChecklist(
        new UUID(applicationChecklistId),
        context.userId,
        message ? new StringValue(message) : undefined,
      )

      return applicationChecklist.toDTO()
    } catch (error) {
      console.error('111111111 dismissApplicationChecklist error', error)
      throw error
    }
  }

  applicationChecklistFullTasks = async (
    parent: DTO<ApplicationChecklistEntity>,
    _: unknown,
  ): Promise<DTO<TaskEntity[]>> => {
    const rootAc = ApplicationChecklistFactory.fromDTO(parent)

    const tasks = [...(rootAc.getTasks() || [])]

    // TODO make recursive
    rootAc.getChilds().reduce((acc, child) => {
      acc.push(...(child.getTasks() || []))
      return acc
    }, tasks)

    return tasks.map((task) => task.toDTO())
  }
}
