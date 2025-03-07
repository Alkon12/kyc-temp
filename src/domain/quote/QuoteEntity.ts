import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { UUID } from '@domain/shared/UUID'
import { BooleanValue } from '../shared/BooleanValue'
import { DateTimeValue } from '../shared/DateTime'
import { UserEntity } from '@domain/user/models/UserEntity'
import { OfferEntity } from '@domain/offer/OfferEntity'
import { ApplicationEntity } from '@domain/application/ApplicationEntity'
import { UserId } from '@domain/user/models/UserId'
import { StringValue } from '@domain/shared/StringValue'
import { DateTimeDiffUnit } from '@domain/shared/base/DateTimeAbstract'
import { JsonValue } from '@domain/shared/JsonValue'
import { ProspectEntity } from '@domain/prospect/ProspectEntity'

export type QuoteEntityProps = {
  id: UUID
  friendlyId?: StringValue
  userId: UserId
  prospectId?: UUID

  scoringComplete: BooleanValue
  scoringError: BooleanValue
  scoringErrorMessage?: StringValue
  scoringEngine?: StringValue
  scoringRaw?: JsonValue

  hasAttachedApplication: BooleanValue
  expiresAt?: DateTimeValue
  createdAt: DateTimeValue
  updatedAt?: DateTimeValue

  user?: UserEntity
  prospect?: ProspectEntity
  offers?: OfferEntity[]
  applications?: ApplicationEntity[]
}

export class QuoteEntity extends AggregateRoot<'QuoteEntity', QuoteEntityProps> {
  get props(): QuoteEntityProps {
    return this._props
  }

  getId(): UUID {
    return this._props.id
  }

  getFriendlyId() {
    return this._props.friendlyId
  }

  getProspectId() {
    return this._props.prospectId
  }

  getUserId() {
    return this._props.userId
  }

  getUser() {
    return this._props.user
  }

  getExpiresAt(): DateTimeValue | undefined {
    return this._props.expiresAt
  }

  getCreatedAt(): DateTimeValue {
    return this._props.createdAt
  }

  getScoringComplete(): boolean {
    return !!this._props.scoringComplete
  }

  getOffers() {
    return this._props.offers
  }

  scoringHadErrors(): boolean {
    return !!this._props.scoringError
  }

  setEngine(value: StringValue) {
    this._props.scoringEngine = value
  }

  setScoringComplete(completed: BooleanValue, scoringRaw?: JsonValue) {
    this._props.scoringComplete = completed
    this._props.scoringRaw = scoringRaw ? scoringRaw : undefined
  }

  setScoringError(withError: boolean, message?: string) {
    this._props.scoringError = new BooleanValue(withError)
    if (message) {
      this._props.scoringErrorMessage = new StringValue(message)
    }
  }

  isActive(): boolean {
    return !this.isExpired() && !this._props.hasAttachedApplication.toDTO()
  }

  isRecent(): boolean {
    return this._props.createdAt?.diff(new DateTimeValue(new Date()), DateTimeDiffUnit.day) < 7
  }

  isExpired(): boolean {
    return true
  }
}
