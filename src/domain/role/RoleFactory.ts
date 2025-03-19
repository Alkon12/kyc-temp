import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { RoleEntity, RoleEntityProps } from './models/RoleEntity'
import { StringValue } from '@domain/shared/StringValue'
import { RoleId } from './models/RoleId'
import { DateTimeValue } from '@domain/shared/DateTime'

export type RoleArgs = Merge<
  Omit<RoleEntityProps, 'rolePermissions' | 'userRoles'>,
  {
    id?: UUID
    createdAt?: DateTimeValue
  }
>

export class RoleFactory {
  static fromDTO(dto: DTO<RoleEntity>): RoleEntity {
    return new RoleEntity({
      id: new RoleId(dto.id),
      roleName: new StringValue(dto.roleName),
      description: dto.description ? new StringValue(dto.description) : undefined,
      createdAt: dto.createdAt ? new DateTimeValue(dto.createdAt) : undefined,
    })
  }

  static create(args: RoleArgs): RoleEntity {
    return new RoleEntity({
      ...args,
      id: args.id ? new RoleId(args.id) : new RoleId(),
      createdAt: args.createdAt || new DateTimeValue(new Date()),
    })
  }
}