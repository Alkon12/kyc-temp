import { GroupId } from '@domain/user/models/GroupId'
import { ChecklistConfig } from '../interfaces/ChecklistConfig'
import { TaskType } from '@domain/task/models/TaskType'
import { ProspectStatusId } from '@domain/prospect/models/ProspectStatusId'

export const VEHICLE_HANDOFF: ChecklistConfig = {
  onStart: async (args, services) => {
    /*
    await services.taskService.create(
      {
        taskTypeId: TaskType.VEHICLE_HANDOFF_PICK_DATE,
        applicationId: args.applicationId,
        applicationChecklistId: args.applicationChecklistId,
        assignedUserId: args.applicationUserId,
      },
      [],
    )

    await services.taskService.create(
      {
        taskTypeId: TaskType.VEHICLE_HANDOFF_CHECKIN,
        applicationId: args.applicationId,
        applicationChecklistId: args.applicationChecklistId,
      },
      [GroupId.BACKOFFICE],
    )

    await services.taskService.create(
      {
        taskTypeId: TaskType.VEHICLE_HANDOFF_CANCEL_DATE,
        applicationId: args.applicationId,
        applicationChecklistId: args.applicationChecklistId,
      },
      [GroupId.BACKOFFICE],
    )
    

    await services.taskService.create(
      {
        taskTypeId: TaskType.VEHICLE_HANDOFF_CONFIRM_DATE,
        applicationId: args.applicationId,
        applicationChecklistId: args.applicationChecklistId,
      },
      [GroupId.BACKOFFICE],
    )
      */

    await services.taskService.create(
      {
        taskTypeId: TaskType.LEASING_CONTRACT_SIGNATURE,
        applicationId: args.applicationId,
        applicationChecklistId: args.applicationChecklistId,
      },
      [GroupId.BACKOFFICE],
    )

    const systemUser = await services.userService.getSystemUser()

    await services.prospectService.updateStatus({
      userId: systemUser.getId(),
      prospectId: args.prospectId,
      prospectStatusId: ProspectStatusId.APPLICATION_AWAITING_HANDOFF,
    })

    return true
  },
}
