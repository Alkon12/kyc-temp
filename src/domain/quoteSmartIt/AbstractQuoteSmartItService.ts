import { injectable } from 'inversify';
import type { IQuoteSmartIt } from '@type/IQuoteSmartIt';
import type { QuoteSmartItEntity } from './QuoteSmartItEntity';

@injectable()
export default abstract class AbstractQuoteSmartItService {
    abstract createQuote(data: IQuoteSmartIt, idSmartIt: string): Promise<QuoteSmartItEntity | null>;
}
