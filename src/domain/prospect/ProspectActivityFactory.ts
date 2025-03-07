import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { ProspectActivityEntity, ProspectActivityEntityProps } from './ProspectActivityEntity'
import { UserFactory } from '@domain/user/UserFactory'
import { StringValue } from '@domain/shared/StringValue'
import { UserId } from '@domain/user/models/UserId'
import { ProspectActivityTypeId } from './models/ProspectActivityTypeId'
import { ProspectFactory } from './ProspectFactory'
import { DateTimeValue } from '@domain/shared/DateTime'
import { ProspectActivityTypeFactory } from './ProspectActivityTypeFactory'
import { ProspectStatusId } from './models/ProspectStatusId'
import { ProspectStatusFactory } from './ProspectStatusFactory'

export type CreateProspectActivityArgs = Omit<ProspectActivityEntityProps, 'id' | 'createdAt'> & {
  id?: UUID
  createdAt?: DateTimeValue
}

export class ProspectActivityFactory {
  static fromDTO(dto: DTO<ProspectActivityEntity>): ProspectActivityEntity {
    return new ProspectActivityEntity({
      id: new UUID(dto.id),
      prospectId: new UUID(dto.prospectId),
      prospectActivityTypeId: new ProspectActivityTypeId(dto.prospectActivityTypeId),
      createdByUserId: dto.createdByUserId ? new UserId(dto.createdByUserId) : undefined,
      notes: dto.notes ? new StringValue(dto.notes) : undefined,
      createdAt: new DateTimeValue(dto.createdAt),
      prospectStatusId: dto.prospectStatusId ? new ProspectStatusId(dto.prospectStatusId) : undefined,

      prospectActivityType: dto.prospectActivityType
        ? ProspectActivityTypeFactory.fromDTO(dto.prospectActivityType)
        : undefined,
      createdByUser: dto.createdByUser ? UserFactory.fromDTO(dto.createdByUser) : undefined,
      prospect: dto.prospect ? ProspectFactory.fromDTO(dto.prospect) : undefined,
      prospectStatus: dto.prospectStatus ? ProspectStatusFactory.fromDTO(dto.prospectStatus) : undefined,
    })
  }

  static create(args: CreateProspectActivityArgs): ProspectActivityEntity {
    return new ProspectActivityEntity({
      ...args,
      id: new UUID(),
      createdAt: new DateTimeValue(new Date()),
    })
  }
}
