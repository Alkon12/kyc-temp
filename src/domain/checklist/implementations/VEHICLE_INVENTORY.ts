import { GroupId } from '@domain/user/models/GroupId'
import { ChecklistConfig } from '../interfaces/ChecklistConfig'
import { TaskType } from '@domain/task/models/TaskType'
import { ProspectStatusId } from '@domain/prospect/models/ProspectStatusId'

export const VEHICLE_INVENTORY: ChecklistConfig = {
  onStart: async (args, services) => {
    
    const systemUser = await services.userService.getSystemUser()

    await services.prospectService.updateStatus({
      userId: systemUser.getId(),
      prospectId: args.prospectId,
      prospectStatusId: ProspectStatusId.APPLICATION_AWAITING_VEHICLE,
    })

    return true
  },
}