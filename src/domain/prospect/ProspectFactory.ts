import { StringValue } from '@domain/shared/StringValue'
import { UserFactory } from '@domain/user/UserFactory'
import { ProspectEntity, ProspectEntityProps } from './ProspectEntity'
import { DateTimeValue } from '@domain/shared/DateTime'
import { UserId } from '@domain/user/models/UserId'
import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { ProspectStatusId } from './models/ProspectStatusId'
import { ProspectStatusFactory } from './ProspectStatusFactory'
import { ProspectActivityFactory } from './ProspectActivityFactory'
import { QuoteFactory } from '@domain/quote/QuoteFactory'
import { ApplicationFactory } from '@domain/application/ApplicationFactory'
import { InvitationFactory } from '@domain/invitation/InvitationFactory'

export type ProspectArgs = Omit<ProspectEntityProps, 'id' | 'createdAt' | 'updatedAt' | 'lastActivityAt'> & {
  id?: UUID
  createdAt?: DateTimeValue
  updatedAt?: DateTimeValue
  lastActivityAt?: DateTimeValue
}

export class ProspectFactory {
  static fromDTO(dto: DTO<ProspectEntity>): ProspectEntity {
    return new ProspectEntity({
      id: new UUID(dto.id),
      userId: new UserId(dto.userId),
      supportUserId: dto.supportUserId ? new UserId(dto.supportUserId) : undefined,
      friendlyId: dto.friendlyId ? new StringValue(dto.friendlyId) : undefined,
      prospectStatusId: new ProspectStatusId(dto.prospectStatusId),
      activeApplicationId: dto.activeApplicationId ? new UUID(dto.activeApplicationId) : undefined,
      createdAt: new DateTimeValue(dto.createdAt),
      updatedAt: new DateTimeValue(dto.updatedAt),
      lastActivityUserId: dto.lastActivityUserId ? new UserId(dto.lastActivityUserId) : undefined,
      lastActivityAt: new DateTimeValue(dto.lastActivityAt),
      prospectProfilingId: dto.prospectProfilingId ? new UUID(dto.prospectProfilingId) : undefined,

      activeApplication: dto.activeApplication ? ApplicationFactory.fromDTO(dto.activeApplication) : undefined,
      prospectStatus: dto.prospectStatus ? ProspectStatusFactory.fromDTO(dto.prospectStatus) : undefined,
      user: dto.user ? UserFactory.fromDTO(dto.user) : undefined,
      supportUser: dto.supportUser ? UserFactory.fromDTO(dto.supportUser) : undefined,
      lastActivityUser: dto.lastActivityUser ? UserFactory.fromDTO(dto.lastActivityUser) : undefined,
      activity: dto.activity?.map(ProspectActivityFactory.fromDTO),
      quotes: dto.quotes?.map(QuoteFactory.fromDTO),
      applications: dto.applications?.map(ApplicationFactory.fromDTO),
      invitations: dto.invitations?.map(InvitationFactory.fromDTO),
    })
  }

  static create(args: ProspectArgs): ProspectEntity {
    return new ProspectEntity({
      ...args,
      id: new UUID(),
      createdAt: new DateTimeValue(new Date()),
      updatedAt: new DateTimeValue(new Date()),
      lastActivityAt: new DateTimeValue(new Date()),
    })
  }
}
