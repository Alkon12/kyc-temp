import { IQuoteSmartIt } from '@type/IQuoteSmartIt';
import { QuoteSmartItEntity } from '@domain/quoteSmartIt/QuoteSmartItEntity';

export default interface QuoteSmartItRepository {
    createQuote(data: IQuoteSmartIt, idSmartIt: string): Promise<QuoteSmartItEntity | null>;
}
