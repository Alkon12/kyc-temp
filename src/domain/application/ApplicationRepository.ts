import { ApplicationEntity } from '@/domain/application/ApplicationEntity'
import { UUID } from '@domain/shared/UUID'
import { UserEntity } from '@domain/user/models/UserEntity'
import { UserId } from '@domain/user/models/UserId'

export default interface ApplicationRepository {
  create(application: ApplicationEntity): Promise<ApplicationEntity>
  save(application: ApplicationEntity): Promise<ApplicationEntity>
  getAll(): Promise<ApplicationEntity[]>
  getById(applicationId: UUID): Promise<ApplicationEntity>
  getByUser(userId: UserId): Promise<ApplicationEntity[]>
  getApplicationUserByApplicationId(applicationId: UUID): Promise<UserEntity | null>
  clearVehicle(applicationId: UUID): Promise<ApplicationEntity>
}
