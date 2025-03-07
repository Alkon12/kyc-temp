import { ApplicationEntity, ApplicationEntityProps } from './ApplicationEntity'
import { DTO } from '@domain/kernel/DTO'
import { UUID } from '@domain/shared/UUID'
import { CreateApplicationResponse } from './interfaces/CreateApplicationResponse'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { UserId } from '@domain/user/models/UserId'

export default abstract class AbstractApplicationService {
  abstract getAll(): Promise<ApplicationEntity[]>
  abstract create(props: DTO<Partial<ApplicationEntityProps>>): Promise<CreateApplicationResponse>
  abstract getById(applicationId: UUID): Promise<ApplicationEntity>
  abstract getActive(): Promise<ApplicationEntity[]>
  abstract getActiveByUser(userId: UserId): Promise<ApplicationEntity | null>
  abstract markKycAsComplete(applicationId: UUID): Promise<ApplicationEntity>
  abstract markAsComplete(applicationId: DTO<UUID>): Promise<ApplicationEntity>
  abstract revoke(applicationId: UUID): Promise<BooleanValue>
}
