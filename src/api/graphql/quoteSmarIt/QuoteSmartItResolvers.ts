import { inject, injectable } from 'inversify';
import { DI } from '@infrastructure';
import type { IQuoteSmartIt } from '@type/IQuoteSmartIt'; // Importa IQuoteSmartIt
import type { QuoteSmartItEntity } from '@domain/quoteSmartIt/QuoteSmartItEntity'; // Importa QuoteSmartItEntity
import AbstractQuoteSmartItService from '@domain/quoteSmartIt/AbstractQuoteSmartItService';

@injectable()
export class QuoteSmartItResolvers {
    constructor(
        @inject(DI.QuoteSmartItService)
        private readonly quoteSmartItService: AbstractQuoteSmartItService
    ) {}

    build() {
        return {
            Mutation: {
                createQuoteSmartIt: this.createQuoteSmartIt,
            },
        };
    }

    private createQuoteSmartIt = async (
        _parent: unknown,
        {
            Marca,
            Modelo,
            Anio,
            UUID,
            IdVersion,
            IdSmartIt
        }: {
            Marca: string;
            Modelo: string;
            Anio: number;
            UUID: string;
            IdVersion: string;
            IdSmartIt: string;
        }
    ): Promise<QuoteSmartItEntity | null> => {
        const data: IQuoteSmartIt = {
            Marca,
            Modelo,
            Anio,
            UUID,
            IdVersion
        };

   
        return await this.quoteSmartItService.createQuote(data, IdSmartIt);
    };
}

