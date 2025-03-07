import { StringValue } from '@domain/shared/StringValue'
import { UserFactory } from '@domain/user/UserFactory'
import { OfferFactory } from '@domain/offer/OfferFactory'
import { QuoteEntity, QuoteEntityProps } from './QuoteEntity'
import { DateTimeValue } from '@domain/shared/DateTime'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { UserId } from '@domain/user/models/UserId'
import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { ProspectFactory } from '@domain/prospect/ProspectFactory'
import { JsonValue } from '@domain/shared/JsonValue'

export type QuoteArgs = Omit<QuoteEntityProps, 'id' | 'createdAt'> & {
  id?: UUID
  createdAt?: DateTimeValue
}

export class QuoteFactory {
  static fromDTO(dto: DTO<QuoteEntity>): QuoteEntity {
    return new QuoteEntity({
      id: new UUID(dto.id),
      userId: new UserId(dto.userId),
      prospectId: dto.prospectId ? new UUID(dto.prospectId) : undefined,
      expiresAt: dto.expiresAt ? new DateTimeValue(dto.expiresAt) : undefined,
      hasAttachedApplication: new BooleanValue(dto.hasAttachedApplication ?? false),
      updatedAt: dto.updatedAt ? new DateTimeValue(dto.updatedAt) : undefined,
      createdAt: new DateTimeValue(dto.createdAt),
      scoringEngine: dto.scoringEngine ? new StringValue(dto.scoringEngine) : undefined,
      scoringComplete: new BooleanValue(dto.scoringComplete ?? false),
      scoringError: new BooleanValue(dto.scoringError ?? false),
      scoringErrorMessage: dto.scoringErrorMessage ? new StringValue(dto.scoringErrorMessage) : undefined,
      scoringRaw: dto.scoringRaw ? new JsonValue(dto.scoringRaw) : undefined,

      user: dto.user ? UserFactory.fromDTO(dto.user) : undefined,
      prospect: dto.prospect ? ProspectFactory.fromDTO(dto.prospect) : undefined,
      offers: dto.offers?.map(OfferFactory.fromDTO),
    })
  }

  static create(args: QuoteArgs): QuoteEntity {
    return new QuoteEntity({
      ...args,
      id: new UUID(),
      createdAt: new DateTimeValue(new Date()),
    })
  }
}
