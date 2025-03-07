import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { UserGroupEntity, UserGroupEntityProps } from './models/UserGroupEntity'
import { DateTimeValue } from '../shared/DateTime'
import { UserFactory } from './UserFactory'
import { GroupFactory } from './GroupFactory'
import { GroupId } from './models/GroupId'
import { UserId } from './models/UserId'

export class UserGroupFactory {
  static fromDTO(dto: DTO<UserGroupEntity>): UserGroupEntity {
    return new UserGroupEntity({
      userId: new UserId(dto.userId),
      groupId: new GroupId(dto.groupId),
      assignedAt: new DateTimeValue(dto.assignedAt),
      assignedBy: dto.assignedBy ? new UUID(dto.assignedBy) : undefined,

      user: dto.user ? UserFactory.fromDTO(dto.user) : undefined,
      group: dto.group ? GroupFactory.fromDTO(dto.group) : undefined,
    })
  }
}
