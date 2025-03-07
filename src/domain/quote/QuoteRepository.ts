import { QuoteEntity } from '@/domain/quote/QuoteEntity'
import { UUID } from '@domain/shared/UUID'
import { UserId } from '@domain/user/models/UserId'

export default interface QuoteRepository {
  create(quote: QuoteEntity): Promise<QuoteEntity>
  save(quote: QuoteEntity): Promise<QuoteEntity>
  getById(quoteId: UUID): Promise<QuoteEntity | null>
  getByUser(userId: UserId): Promise<QuoteEntity[]>
  getAll(fullObject?: boolean): Promise<QuoteEntity[]>
}
