import { inject, injectable } from 'inversify'
import type { IQuoteSmartIt } from '@type/IQuoteSmartIt'
import type { QuoteSmartItEntity } from '@domain/quoteSmartIt/QuoteSmartItEntity'
import type QuoteSmartItRepository from '@domain/quoteSmartIt/QuoteSmartItRepository'
import { DI } from '@infrastructure'
import AbstractQuoteSmartItService from '@domain/quoteSmartIt/AbstractQuoteSmartItService'

@injectable()
export class QuoteSmartItService extends AbstractQuoteSmartItService {
  constructor(
    @inject(DI.QuoteSmartItRepository)
    private readonly quoteSmartItRepository: QuoteSmartItRepository,
  ) {
    super()
  }

  async createQuote(data: IQuoteSmartIt, idSmartIt: string): Promise<QuoteSmartItEntity | null> {
    return this.quoteSmartItRepository.createQuote(data, idSmartIt)
  }
}
