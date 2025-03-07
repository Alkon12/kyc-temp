import { GroupId } from '@domain/user/models/GroupId'
import { ChecklistConfig } from '../interfaces/ChecklistConfig'
import { TaskType } from '@domain/task/models/TaskType'
import { ProspectStatusId } from '@domain/prospect/models/ProspectStatusId'

export const VEHICLE_DOCUMENTATION: ChecklistConfig = {
  onStart: async (args, services) => {
    //await services.taskService.create(
    //  {
    //    taskTypeId: TaskType.VEHICLE_TITLE,
    //    applicationId: args.applicationId,
    //    applicationChecklistId: args.applicationChecklistId,
    //  },
    //  [GroupId.BACKOFFICE],
    //)

    //await services.taskService.create(
    //  {
    //    taskTypeId: TaskType.VEHICLE_AUTHORIZATION,
    //    applicationId: args.applicationId,
    //    applicationChecklistId: args.applicationChecklistId,
    //  },
    //  [GroupId.BACKOFFICE],
    //)

    //await services.taskService.create(
    //  {
    //    taskTypeId: TaskType.VEHICLE_ASSURANCE,
    //    applicationId: args.applicationId,
    //    applicationChecklistId: args.applicationChecklistId,
    //  },
    //  [GroupId.BACKOFFICE],
    //)

    const systemUser = await services.userService.getSystemUser()

    await services.prospectService.updateStatus({
      userId: systemUser.getId(),
      prospectId: args.prospectId,
      prospectStatusId: ProspectStatusId.APPLICATION_AWAITING_ACCOUNT_AND_PAYMENT,
    })

    return true
  },
}
