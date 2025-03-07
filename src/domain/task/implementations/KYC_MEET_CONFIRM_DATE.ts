import { ChecklistId } from '@domain/checklist/models/ChecklistId'
import { TaskTypeConfig } from '../TaskManager'
import { DispatchValidationError } from '../models/DispatchValidationError'
import { TaskType } from '../models/TaskType'
import { GroupId } from '@domain/user/models/GroupId'
import { UnexpectedError } from '@domain/error'
import { MeetingService } from '@/application/service/MeetingService'
import { DI } from '@infrastructure'
import container from '@infrastructure/inversify.config'
import { JsonValue } from '@domain/shared/JsonValue'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { ProspectStatusId } from '@domain/prospect/models/ProspectStatusId'
import { NotificationChannel } from '@domain/shared/NotificationChannel'
import { StringValue } from '@domain/shared/StringValue'

export const KYC_MEET_CONFIRM_DATE: TaskTypeConfig = {
  accept: async (args, services) => {
    const application = args.task.getApplication()
    if (!application) throw new DispatchValidationError('Application inexistent or inactive')

    const slotId = args.task.getSlotId()
    if (!slotId) {
      throw new UnexpectedError('A referenced slot is expected in this task')
    }
    console.log('KYC_MEET_CONFIRM_DATE slotId', slotId)

    const prospectId = application.getProspectId()
    console.log('KYC_MEET_CONFIRM_DATE prospectId', prospectId)

    const backofficeUserId = args.userId
    const applicationUserId = application.getUserId()

    const applicationChecklistForMeetLive =
      await services.applicationChecklistService.getApplicationChecklistByApplicationAndChecklistId(
        application.getId(),
        ChecklistId.KYC_MEET_LIVE,
      )

    await services.taskService.create(
      {
        taskTypeId: TaskType.KYC_MEET_CANCEL_DATE,
        applicationId: application.getId(),
        applicationChecklistId: args.task.getApplicationChecklistId(),
        slotId,
        optional: new BooleanValue(true),
        originTaskId: args.task.getId(),
      },
      [GroupId.BACKOFFICE],
    )

    const { guestLink, hostLink } = await container.get<MeetingService>(DI.MeetingService).generateMeetingLinks()

    await services.taskService.create({
      taskTypeId: TaskType.KYC_MEET_HOST_INVITATION,
      applicationId: application.getId(),
      applicationChecklistId: applicationChecklistForMeetLive.getId(),
      // todo agregar fecha de habilitacion
      assignedUserId: backofficeUserId,
      slotId,
      customData: new JsonValue({
        meetLink: hostLink.toDTO(),
      }),
      optional: new BooleanValue(true),
      originTaskId: args.task.getId(),
    })

    await services.taskService.create({
      taskTypeId: TaskType.KYC_MEET_GUEST_INVITATION,
      applicationId: application.getId(),
      applicationChecklistId: applicationChecklistForMeetLive.getId(),
      // todo agregar fecha de habilitacion
      assignedUserId: applicationUserId,
      slotId,
      customData: new JsonValue({
        meetLink: guestLink.toDTO(),
      }),
      optional: new BooleanValue(true),
      originTaskId: args.task.getId(),
    })

    await services.taskService.create(
      {
        taskTypeId: TaskType.KYC_MEET_CHECKIN,
        applicationId: application.getId(),
        assignedUserId: backofficeUserId,
        applicationChecklistId: applicationChecklistForMeetLive.getId(),
        originTaskId: args.task.getId(),
      },
      [],
    )

    await services.taskService.create(
      {
        taskTypeId: TaskType.KYC_MEET_ADDRESS_MATCH,
        applicationId: application.getId(),
        assignedUserId: backofficeUserId,
        applicationChecklistId: applicationChecklistForMeetLive.getId(),
        originTaskId: args.task.getId(),
      },
      [],
    )

    await services.applicationChecklistService.complete({
      userId: backofficeUserId,
      applicationId: application.getId(),
      prospectId,
      checklistId: ChecklistId.KYC_MEET_SCHEDULE,
    })

    await services.prospectService.updateStatus({
      userId: backofficeUserId,
      prospectId,
      prospectStatusId: ProspectStatusId.APPLICATION_KYC_AWAITING_MEET,
    })

    const slot = await services.slotService.getById(slotId)
    const slotStartsAt = slot.getStartsAt()
    const slotStartsAtString = slotStartsAt
      ? new StringValue(
          `Confirmamos tu cita del ${slotStartsAt.toFormat('dd/MM/yyyy')} a las ${slotStartsAt.toFormat('HH:mm')}hs !`,
        )
      : new StringValue(`Confirmamos tu cita!`)

    await services.notificationService.sendToUser(applicationUserId, {
      channel: [NotificationChannel.EMAIL],
      title: slotStartsAtString,
      content: new StringValue(`Deberás acceder desde la APP cuando sea el momento`),
    })

    return true
  },
  decline: async (args, services) => {
    const application = args.task.getApplication()
    if (!application) throw new DispatchValidationError('Application inexistent or inactive')

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
