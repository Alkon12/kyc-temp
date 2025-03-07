import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { OfferEntity, OfferEntityProps } from './OfferEntity'
import { DateTimeValue } from '../shared/DateTime'
import { NumberValue } from '@domain/shared/NumberValue'
import { ProductFactory } from '@domain/product/ProductFactory'
import { QuoteFactory } from '@domain/quote/QuoteFactory'
import { UserFactory } from '@domain/user/UserFactory'
import { UserId } from '@domain/user/models/UserId'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { StringValue } from '@domain/shared/StringValue'
import { ScoringMark } from '@domain/scoring/models/ScoringMark'
import { ScoringResolution } from '@domain/scoring/models/ScoringResolution'
import { JsonValue } from '@domain/shared/JsonValue'

export type OfferArgs = Merge<
  OfferEntityProps,
  {
    id?: UUID
  }
>

export class OfferFactory {
  static fromDTO(dto: DTO<OfferEntity>): OfferEntity {
    return new OfferEntity({
      id: new UUID(dto.id),
      userId: new UserId(dto.userId),
      quoteId: new UUID(dto.quoteId),
      productId: new UUID(dto.productId),
      weeklyPrice: dto.weeklyPrice ? new NumberValue(dto.weeklyPrice) : undefined,
      leasingPeriod: dto.leasingPeriod ? new NumberValue(dto.leasingPeriod) : undefined,
      expiresAt: dto.expiresAt ? new DateTimeValue(dto.expiresAt) : undefined,
      hasAttachedApplication: dto.hasAttachedApplication
        ? new BooleanValue(dto.hasAttachedApplication)
        : new BooleanValue(false),
      scoringResolution: dto.scoringResolution ? new ScoringResolution(dto.scoringResolution) : undefined,
      scoringMark: dto.scoringMark ? new ScoringMark(dto.scoringMark) : undefined,
      scoringVerdict: dto.scoringVerdict ? new JsonValue(dto.scoringVerdict) : undefined,
      scoringBrief: dto.scoringBrief ? new JsonValue(dto.scoringBrief) : undefined,
      scoringDetails: dto.scoringDetails ? new JsonValue(dto.scoringDetails) : undefined,
      scoringAnalysis: dto.scoringAnalysis ? new JsonValue(dto.scoringAnalysis) : undefined,
      requestedChecklist: dto.requestedChecklist ? new StringValue(dto.requestedChecklist) : undefined,
      createdAt: dto.createdAt ? new DateTimeValue(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new DateTimeValue(dto.updatedAt) : undefined,
      product: dto.product ? ProductFactory.fromDTO(dto.product) : undefined,
      quote: dto.quote ? QuoteFactory.fromDTO(dto.quote) : undefined,
      user: dto.user ? UserFactory.fromDTO(dto.user) : undefined,
    })
  }

  static create(args: OfferArgs): OfferEntity {
    return new OfferEntity({
      id: new UUID(),
      ...args,
    })
  }
}
