import { NotificationService } from '@/application/service/NotificationService'
import AbstractTaskService from '@domain/task/TaskService'
import AbstractProspectService from '@domain/prospect/ProspectService'
import AbstractUserService from '@domain/user/UserService'

export interface ChecklistDispatchServices {
  taskService: AbstractTaskService
  notificationService: NotificationService
  prospectService: AbstractProspectService
  userService: AbstractUserService
}
