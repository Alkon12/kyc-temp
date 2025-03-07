import { GroupId } from '@domain/user/models/GroupId'
import { ChecklistConfig } from '../interfaces/ChecklistConfig'
import { TaskType } from '@domain/task/models/TaskType'

export const KYC_MEET_LIVE: ChecklistConfig = {
  onStart: async (args, services) => {
    return true
  },
}
