import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { UUID } from '@domain/shared/UUID'
import { DateTimeValue } from '../shared/DateTime'
import { NumberValue } from '@domain/shared/NumberValue'
import { QuoteEntity } from '@domain/quote/QuoteEntity'
import { ProductEntity } from '@domain/product/ProductEntity'
import { UserEntity } from '@domain/user/models/UserEntity'
import { UserId } from '@domain/user/models/UserId'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { StringValue } from '@domain/shared/StringValue'
import { JsonValue } from '@domain/shared/JsonValue'
import { ChecklistId } from '@domain/checklist/models/ChecklistId'
import { ScoringMark } from '@domain/scoring/models/ScoringMark'
import { ScoringResolution } from '@domain/scoring/models/ScoringResolution'

export type OfferEntityProps = {
  id: UUID
  userId: UserId
  quoteId: UUID
  productId: UUID
  weeklyPrice?: NumberValue
  leasingPeriod?: NumberValue
  hasAttachedApplication: BooleanValue
  expiresAt?: DateTimeValue
  createdAt?: DateTimeValue
  updatedAt?: DateTimeValue

  scoringResolution?: ScoringResolution
  scoringMark?: ScoringMark
  scoringVerdict?: JsonValue
  scoringBrief?: JsonValue
  scoringDetails?: JsonValue
  scoringAnalysis?: JsonValue
  requestedChecklist?: StringValue

  user?: UserEntity
  quote?: QuoteEntity
  product?: ProductEntity
}

export class OfferEntity extends AggregateRoot<'OfferEntity', OfferEntityProps> {
  get props(): OfferEntityProps {
    return this._props
  }

  getId(): UUID {
    return this._props.id
  }

  getQuoteId(): UUID {
    return this._props.quoteId
  }

  getQuote() {
    return this._props.quote
  }

  getScoringMark(): ScoringMark | undefined {
    return this._props.scoringMark
  }

  getProductId(): UUID {
    return this._props.productId
  }

  getProduct() {
    return this._props.product
  }

  getUserId() {
    return this._props.userId
  }

  getScoringResolution(): ScoringResolution | undefined {
    return this._props.scoringResolution
  }

  getScoringDetails(): JsonValue {
    return this._props.scoringDetails ?? new JsonValue([])
  }

  setScoringResolution(value: ScoringResolution) {
    this._props.scoringResolution = value
  }

  setScoringMark(value: ScoringMark) {
    this._props.scoringMark = value
  }

  setScoringVerdict(value: JsonValue) {
    this._props.scoringVerdict = value
  }

  setScoringBrief(value: JsonValue) {
    this._props.scoringBrief = value
  }

  setScoringAnalysis(value: JsonValue) {
    this._props.scoringAnalysis = value
  }

  setScoringDetails(value: JsonValue) {
    this._props.scoringDetails = value
  }

  setRequestedChecklist(value: ChecklistId[]) {
    this._props.requestedChecklist = value ? new StringValue(value.map((v) => `[${v.toDTO()}]`).join('')) : undefined
  }

  getRequestedChecklist(): ChecklistId[] {
    return (
      this._props.requestedChecklist
        ?.toDTO()
        .replaceAll('[', '')
        .slice(0, -1)
        .split(']')
        .map((t) => new ChecklistId(t)) ?? []
    )
  }
}
