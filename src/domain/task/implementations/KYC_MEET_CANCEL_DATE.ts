import container from '@infrastructure/inversify.config'
import { TaskTypeConfig } from '../TaskManager'
import { DispatchValidationError } from '../models/DispatchValidationError'
import { TaskType } from '../models/TaskType'
import { DI } from '@infrastructure'
import AbstractUserService from '@domain/user/UserService'
import { TaskAction } from '../models/TaskAction'
import { StringValue } from '@domain/shared/StringValue'
import { UnexpectedError } from '@domain/error'
import AbstractSlotService from '@domain/slot/SlotService'
import { ProspectStatusId } from '@domain/prospect/models/ProspectStatusId'

export const KYC_MEET_CANCEL_DATE: TaskTypeConfig = {
  accept: async (args, services) => {
    const application = args.task.getApplication()
    if (!application) throw new DispatchValidationError('Application inexistent or inactive')

    const userService = container.get<AbstractUserService>(DI.UserService)
    const systemUser = await userService.getSystemUser()
    const currentUser = await userService.getById(args.userId)

    const slotId = args.task.getSlotId()
    if (!slotId) {
      throw new UnexpectedError('A referenced slot is expected in this task')
    }
    await container.get<AbstractSlotService>(DI.SlotService).freeSlot(slotId)

    const tasksToDecline = await services.taskService.getPendingByTypeAndApplication(application.getId(), [
      TaskType.KYC_MEET_CONFIRM_DATE,
      TaskType.KYC_MEET_CANCEL_DATE,
      TaskType.KYC_MEET_HOST_INVITATION,
      TaskType.KYC_MEET_GUEST_INVITATION,
      TaskType.KYC_MEET_CHECKIN,
      TaskType.KYC_MEET_ADDRESS_MATCH,
    ])

    await Promise.all(
      tasksToDecline.map(async (task) => {
        await services.taskService.move({
          userId: systemUser.getId(),
          taskId: task.getId(),
          taskAction: TaskAction.DISMISS,
          metadata: {
            message: new StringValue(
              `La fecha fue cancelada por ${currentUser.getName().toDTO()} y la razón fue: ${args.metadata?.message?.toDTO() || 'No especificada'}`,
            ),
          },
        })
      }),
    )

    await services.taskService.create({
      taskTypeId: TaskType.KYC_MEET_PICK_DATE,
      applicationId: application.getId(),
      assignedUserId: application.getUserId(),
      applicationChecklistId: args.task.getApplicationChecklistId(),
      originTaskId: args.task.getId(),
    })

    await services.prospectService.updateStatus({
      userId: args.userId,
      prospectId: application.getProspectId(),
      prospectStatusId: ProspectStatusId.APPLICATION_KYC_AWAITING_DOCUMENTATION,
    })

    return true
  },
}
