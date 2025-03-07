import { GroupId } from '@domain/user/models/GroupId'
import { ChecklistConfig } from '../interfaces/ChecklistConfig'
import { TaskType } from '@domain/task/models/TaskType'

export const KYC_MEET_SCHEDULE: ChecklistConfig = {
  onStart: async (args, services) => {
    await services.taskService.create({
      taskTypeId: TaskType.KYC_MEET_PICK_DATE,
      applicationId: args.applicationId,
      assignedUserId: args.applicationUserId,
      applicationChecklistId: args.applicationChecklistId,
    })

    // No need since all user actions are being triggered at the same time
    // const systemUser = await services.userService.getSystemUser()

    // await services.prospectService.updateStatus({
    //   userId: systemUser.getId(),
    //   prospectId: args.prospectId,
    //   prospectStatusId: ProspectStatusId.APPLICATION_AWAITING_PREAPPROVAL
    // })

    return true
  },
}
