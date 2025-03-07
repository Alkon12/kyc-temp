import { QuoteSmartItEntity } from './QuoteSmartItEntity';
import { IQuoteSmartItResponse } from '@type/IQuoteSmartItResponse';

export class QuoteSmartItFactory {
    public static fromDTO(data: IQuoteSmartItResponse): QuoteSmartItEntity {
        return new QuoteSmartItEntity(
            data.IdAgencia,
            data.IdCotizacion,
            data.IdPersona,
            data.LinkReporte,
        );
    }
}
