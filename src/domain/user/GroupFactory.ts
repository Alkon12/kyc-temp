import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { StringValue } from '@domain/shared/StringValue'
import { GroupEntity, GroupEntityProps } from './models/GroupEntity'
import { UserGroupFactory } from './UserGroupFactory'
import { GroupId } from './models/GroupId'

export type GroupArgs = Merge<
  GroupEntityProps,
  {
    id?: UUID
  }
>

export class GroupFactory {
  static fromDTO(dto: DTO<GroupEntity>): GroupEntity {
    return new GroupEntity({
      id: new GroupId(dto.id),
      title: new StringValue(dto.title),

      users: dto.users ? dto.users.map((u) => UserGroupFactory.fromDTO(u)) : [],
    })
  }
}
