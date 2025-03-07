import { GroupId } from '@domain/user/models/GroupId'
import { TaskType } from '@domain/task/models/TaskType'
import { ChecklistConfig } from '../interfaces/ChecklistConfig'
import { ProspectStatusId } from '@domain/prospect/models/ProspectStatusId'
import { BooleanValue } from '@domain/shared/BooleanValue'

export const IDENTIFICATION_CARD: ChecklistConfig = {
  onStart: async (args, services) => {
    await services.taskService.create({
      taskTypeId: TaskType.KYC_IDENTIFICATION_CARD_UPLOAD,
      applicationId: args.applicationId,
      assignedUserId: args.applicationUserId,
      applicationChecklistId: args.applicationChecklistId,
    })

    await services.taskService.create({
      taskTypeId: TaskType.KYC_IDENTIFICATION_CARD_REVERSE_UPLOAD,
      applicationId: args.applicationId,
      assignedUserId: undefined, // TODO: ASING TO USER
      applicationChecklistId: args.applicationChecklistId,
      optional: new BooleanValue(true)
    })

    const systemUser = await services.userService.getSystemUser()

    await services.prospectService.updateStatus({
      userId: systemUser.getId(),
      prospectId: args.prospectId,
      prospectStatusId: ProspectStatusId.APPLICATION_KYC_AWAITING_DOCUMENTATION,
    })

    return true
  },
}
