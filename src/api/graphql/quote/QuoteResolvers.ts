import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { QuoteEntity } from '@domain/quote/QuoteEntity'
import { DTO } from '@domain/kernel/DTO'
import {
  MutationCreateQuoteArgs,
  MutationGetOrCreateQuoteArgs,
  QueryQuoteByIdArgs,
  QueryQuotesByUserArgs,
} from '../app.schema.gen'
import { QuoteFactory } from '@domain/quote/QuoteFactory'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { UUID } from '@domain/shared/UUID'
import AbstractQuoteService from '@domain/quote/QuoteService'
import { UserId } from '@domain/user/models/UserId'

@injectable()
export class QuoteResolvers {
  build() {
    return {
      Query: {
        quoteById: this.quoteById,
        quotesByUser: this.quotesByUser,
        activeQuotes: this.activeQuotes,
      },
      Mutation: {
        createQuote: this.createQuote,
        getOrCreateQuote: this.getOrCreateQuote,
      },
      Quote: {
        isRecent: this.isRecent,
        isActive: this.isActive,
        isExpired: this.isExpired,
      },
    }
  }

  quoteById = async (_parent: unknown, { quoteId }: QueryQuoteByIdArgs): Promise<DTO<QuoteEntity | null>> => {
    const quoteService = container.get<AbstractQuoteService>(DI.QuoteService)
    const quote = await quoteService.getById(new UUID(quoteId))
    if (!quote) {
      return null
    }

    return quote.toDTO()
  }

  isRecent = async (parent: DTO<QuoteEntity>, _: unknown): Promise<DTO<BooleanValue>> => {
    const quote = QuoteFactory.fromDTO(parent)

    return quote.isRecent()
  }

  isActive = async (parent: DTO<QuoteEntity>, _: unknown): Promise<DTO<BooleanValue>> => {
    const quote = QuoteFactory.fromDTO(parent)

    return quote.isActive()
  }

  isExpired = async (parent: DTO<QuoteEntity>, _: unknown): Promise<DTO<BooleanValue>> => {
    const quote = QuoteFactory.fromDTO(parent)

    return quote.isExpired()
  }

  activeQuotes = async (_parent: unknown): Promise<DTO<QuoteEntity[]>> => {
    const quoteService = container.get<AbstractQuoteService>(DI.QuoteService)
    const quotes = await quoteService.getActive()

    return quotes.map((q) => q.toDTO())
  }

  quotesByUser = async (_parent: unknown, { userId }: QueryQuotesByUserArgs): Promise<DTO<QuoteEntity[]>> => {
    const quoteService = container.get<AbstractQuoteService>(DI.QuoteService)
    const quotes = await quoteService.getByUser(new UserId(userId))

    return quotes.map((q) => q.toDTO())
  }

  createQuote = async (_parent: unknown, { userId }: MutationCreateQuoteArgs): Promise<DTO<QuoteEntity>> => {
    const quoteService = container.get<AbstractQuoteService>(DI.QuoteService)

    const quote = await quoteService.create({
      userId,
    })

    return quote.toDTO()
  }

  getOrCreateQuote = async (_parent: unknown, { userId }: MutationGetOrCreateQuoteArgs): Promise<DTO<QuoteEntity>> => {
    const quoteService = container.get<AbstractQuoteService>(DI.QuoteService)

    const quote = await quoteService.getActiveForUser({
      userId,
    })

    return quote.toDTO()
  }
}
