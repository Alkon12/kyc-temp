import { TaskEntity } from '../TaskEntity'

export interface TasksByUserResponse {
  userAssigned: TaskEntity[]
  userGroupsAssigned: TaskEntity[]
}
