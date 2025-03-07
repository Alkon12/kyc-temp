import { ChecklistId } from '@domain/checklist/models/ChecklistId'
import { TaskTypeConfig } from '../TaskManager'
import { DispatchValidationError } from '../models/DispatchValidationError'
import { NotificationChannel } from '@domain/shared/NotificationChannel'
import { StringValue } from '@domain/shared/StringValue'
import { ProspectActivityTypeId } from '@domain/prospect/models/ProspectActivityTypeId'
import { ProspectStatusId } from '@domain/prospect/models/ProspectStatusId'

export const APPLICATION_BACKOFFICE_APPROVAL: TaskTypeConfig = {
  validation: (args, services) => {
    const application = args.task.getApplication()
    if (!application) return new DispatchValidationError('Application inexistent or inactive')
    if (!application.getQuote()?.getScoringComplete())
      return new DispatchValidationError('Quote with scoring incomplete')

    return null
  },
  accept: async (args, services) => {
    const application = args.task.getApplication()
    if (!application) throw new DispatchValidationError('Application inexistent or inactive')

    await services.applicationChecklistService.complete({
      userId: args.userId,
      applicationId: application.getId(),
      prospectId: application.getProspectId(),
      checklistId: ChecklistId.ONBOARD_BACKOFFICE_APPROVAL,
    })

    await services.notificationService.sendToUser(application.getUserId(), {
      channel: [NotificationChannel.EMAIL],
      title: new StringValue('Inicio de solicitud aprobada'),
      content: new StringValue('Bajate la APP y sigue los pasos que te indicaremos allí'),
    })

    await services.prospectService.logActivity({
      userId: args.userId,
      prospectId: application.getProspectId(),
      prospectActivityTypeId: ProspectActivityTypeId.APPLICATION_PREAPPROVAL_ACCEPTED,
    })

    return true
  },
  decline: async (args, services) => {
    const application = args.task.getApplication()
    if (!application) throw new DispatchValidationError('Application inexistent or inactive')

    // await services.notificationService.sendToUser(application.getUserId(), {
    //   channel: [NotificationChannel.EMAIL],
    //   title: new StringValue('Inicio de solicitud rechazada'),
    //   content: new StringValue('Bajate la APP y sigue los pasos que te indicaremos allí'),
    // })

    await services.prospectService.logActivity({
      userId: args.userId,
      prospectId: application.getProspectId(),
      prospectActivityTypeId: ProspectActivityTypeId.APPLICATION_PREAPPROVAL_REQUESTED,
    })

    await services.prospectService.updateStatus({
      userId: args.userId,
      prospectId: application.getProspectId(),
      prospectStatusId: ProspectStatusId.APPLICATION_REJECTED,
    })

    return true
  },
}
