import { QuoteEntity, QuoteEntityProps } from './QuoteEntity'
import { DTO } from '@domain/kernel/DTO'
import { UUID } from '@domain/shared/UUID'
import { UserId } from '@domain/user/models/UserId'

/**
 * Abstract service for managing quotes.
 * @abstract
 */
export default abstract class AbstractQuoteService {
  /**
   * Creates a new quote.
   * @abstract
   * @param {DTO<Partial<QuoteEntityProps>>} props - The properties of the quote to create.
   * @returns {Promise<QuoteEntity>} The created quote entity.
   */
  abstract create(props: DTO<Partial<QuoteEntityProps>>): Promise<QuoteEntity>

  /**
   * Gets the active quote for a user.
   * @abstract
   * @param {DTO<Partial<QuoteEntityProps>>} props - The properties to identify the user.
   * @returns {Promise<QuoteEntity>} The active quote entity for the user.
   */
  abstract getActiveForUser(props: DTO<Partial<QuoteEntityProps>>): Promise<QuoteEntity>

  /**
   * Gets a quote by its ID.
   * @abstract
   * @param {UUID} quoteId - The ID of the quote to retrieve.
   * @returns {Promise<QuoteEntity | null>} The quote entity if found, otherwise null.
   */
  abstract getById(quoteId: UUID): Promise<QuoteEntity | null>

  /**
   * Gets all active quotes.
   * @abstract
   * @returns {Promise<QuoteEntity[]>} An array of active quote entities.
   */
  abstract getActive(): Promise<QuoteEntity[]>

  abstract getByUser(userId: UserId): Promise<QuoteEntity[]>
}
