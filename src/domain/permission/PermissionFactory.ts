import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { PermissionEntity, PermissionEntityProps } from './models/PermissionEntity'
import { StringValue } from '@domain/shared/StringValue'
import { PermissionId } from './models/PermissionId'
import { DateTimeValue } from '@domain/shared/DateTime'

export type PermissionArgs = Merge<
  Omit<PermissionEntityProps, 'rolePermissions'>,
  {
    id?: UUID
    createdAt?: DateTimeValue
  }
>

export class PermissionFactory {
  static fromDTO(dto: DTO<PermissionEntity>): PermissionEntity {
    return new PermissionEntity({
      id: new PermissionId(dto.id),
      permissionName: new StringValue(dto.permissionName),
      description: dto.description ? new StringValue(dto.description) : undefined,
      createdAt: dto.createdAt ? new DateTimeValue(dto.createdAt) : undefined,
    })
  }

  static create(args: PermissionArgs): PermissionEntity {
    return new PermissionEntity({
      ...args,
      id: args.id ? new PermissionId(args.id) : new PermissionId(),
      createdAt: args.createdAt || new DateTimeValue(new Date()),
    })
  }
}