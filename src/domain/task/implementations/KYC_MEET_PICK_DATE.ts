import { DI } from '@infrastructure'
import { TaskTypeConfig } from '../TaskManager'
import { DispatchValidationError } from '../models/DispatchValidationError'
import { TaskType } from '../models/TaskType'
import { GroupId } from '@domain/user/models/GroupId'
import AbstractSlotService from '@domain/slot/SlotService'
import container from '@infrastructure/inversify.config'
import { UnexpectedError } from '@domain/error'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { NotificationChannel } from '@domain/shared/NotificationChannel'
import { StringValue } from '@domain/shared/StringValue'

export const KYC_MEET_PICK_DATE: TaskTypeConfig = {
  accept: async (args, services) => {
    const application = args.task.getApplication()
    if (!application) throw new DispatchValidationError('Application inexistent or inactive')

    const prospectId = application.getProspectId()
    console.log('KYC_MEET_PICK_DATE prospectId', prospectId)

    const slotId = args.metadata?.slotId
    if (!slotId) {
      throw new UnexpectedError('no slot attached to the task')
    }
    await container.get<AbstractSlotService>(DI.SlotService).pickSlot(slotId, args.userId, prospectId)

    await services.taskService.create(
      {
        taskTypeId: TaskType.KYC_MEET_CONFIRM_DATE,
        applicationId: application.getId(),
        applicationChecklistId: args.task.getApplicationChecklistId(),
        slotId,
        originTaskId: args.task.getId(),
      },
      [GroupId.BACKOFFICE],
    )

    await services.taskService.create({
      taskTypeId: TaskType.KYC_MEET_CANCEL_DATE,
      applicationId: application.getId(),
      applicationChecklistId: args.task.getApplicationChecklistId(),
      assignedUserId: application.getUserId(),
      slotId,
      optional: new BooleanValue(true),
      originTaskId: args.task.getId(),
    })

    await services.notificationService.sendToGroup(GroupId.BACKOFFICE, {
      channel: [NotificationChannel.EMAIL],
      title: new StringValue('Usuario esperando confirmación de fecha'),
      content: new StringValue(`El prospecto: ${application.getProspectId().toDTO()}`),
    })

    return true
  },
}
