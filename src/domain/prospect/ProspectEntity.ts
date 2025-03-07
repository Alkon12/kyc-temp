import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { UUID } from '@domain/shared/UUID'
import { DateTimeValue } from '../shared/DateTime'
import { UserEntity } from '@domain/user/models/UserEntity'
import { UserId } from '@domain/user/models/UserId'
import { StringValue } from '@domain/shared/StringValue'
import { ProspectStatusEntity } from './ProspectStatusEntity'
import { ProspectStatusId } from './models/ProspectStatusId'
import { ProspectActivityEntity } from './ProspectActivityEntity'
import { QuoteEntity } from '@domain/quote/QuoteEntity'
import { ApplicationEntity } from '@domain/application/ApplicationEntity'
import { InvitationEntity } from '@domain/invitation/InvitationEntity'

export type ProspectEntityProps = {
  id: UUID
  friendlyId?: StringValue
  userId: UserId
  supportUserId?: UserId

  createdAt: DateTimeValue
  updatedAt: DateTimeValue

  prospectStatusId: ProspectStatusId
  activeApplicationId?: UUID

  lastActivityAt: DateTimeValue
  lastActivityUserId?: UserId
  prospectProfilingId?: UUID

  activeApplication?: ApplicationEntity
  user?: UserEntity
  lastActivityUser?: UserEntity
  supportUser?: UserEntity
  prospectStatus?: ProspectStatusEntity
  activity?: ProspectActivityEntity[]
  quotes?: QuoteEntity[]
  applications?: ApplicationEntity[]
  invitations?: InvitationEntity[]
}

export class ProspectEntity extends AggregateRoot<'ProspectEntity', ProspectEntityProps> {
  get props(): ProspectEntityProps {
    return this._props
  }

  getId(): UUID {
    return this._props.id
  }

  getFriendlyId() {
    return this._props.friendlyId
  }

  getProspectStatusId() {
    return this._props.prospectStatusId
  }

  getUserId() {
    return this._props.userId
  }

  getUser() {
    return this._props.user
  }

  getCreatedAt(): DateTimeValue {
    return this._props.createdAt
  }

  getUpdatedAt(): DateTimeValue {
    return this._props.updatedAt
  }

  getLastActivityAt(): DateTimeValue {
    return this._props.lastActivityAt
  }

  getLastActivityUser() {
    return this._props.lastActivityUser
  }

  getQuotes(): QuoteEntity[] {
    return this._props.quotes ?? []
  }

  getQuoteCount(): number {
    return this.getQuotes().length
  }

  setProspectStatus(prospectStatusId: ProspectStatusId) {
    this._props.prospectStatusId = prospectStatusId
  }

  setSupportUserId(supportUserId: UserId) {
    this._props.supportUserId = supportUserId
  }

  setLastActivityUserId(lastActivityUserId: UserId) {
    this._props.lastActivityUserId = lastActivityUserId
  }

  setLastActivityAt(lastActivityAt: DateTimeValue) {
    this._props.lastActivityAt = lastActivityAt
  }

  setActiveApplicationId(activeApplicationId?: UUID) {
    this._props.activeApplicationId = activeApplicationId
  }
}
