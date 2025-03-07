
import { injectable } from 'inversify';
import fetch from 'node-fetch';
import { QuoteSmartItEntity } from '@domain/quoteSmartIt/QuoteSmartItEntity';
import QuoteSmartItRepository from '@domain/quoteSmartIt/QuoteSmartItRepository';
import { IQuoteSmartIt } from '@type/IQuoteSmartIt';
import { PrismaClient } from '@prisma/client';

@injectable()
export class QuoteSmartItApi implements QuoteSmartItRepository {
    private prisma: PrismaClient;
    private readonly URL: string;

    constructor() {
        this.prisma = new PrismaClient();
        this.URL = `${process.env.NEXT_PUBLIC_URL_SMARTIT}cotizacion`;
    }

    async createQuote(data: IQuoteSmartIt, idSmartIt: string): Promise<QuoteSmartItEntity | null> {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SMARTIT_API_SECRET_KEY}`
            },
            body: JSON.stringify(data)
        };

        const response = await fetch(this.URL, options);
        const result = await response.json();

        if (result && result.Message) {
            throw new Error(`Error creating quote: ${result.Message}`);
        }

        const quoteSmartItEntity = new QuoteSmartItEntity(
            result.IdAgencia,
            result.IdCotizacion,
            result.IdPersona,
            result.LinkReporte
        );

        await this.updateQuoteSmartItId(result.IdPersona, result.IdCotizacion, data.UUID);

        return quoteSmartItEntity;
    }

    private async updateQuoteSmartItId(idpersona: number, quoteSmartItId: number, IdUsuario: string): Promise<void> {
        try {

            const updateResult = await this.prisma.application.updateMany({
                where: { userId: IdUsuario },
                data: {
                    quoteSmartItId: String(quoteSmartItId),
                    idpersona: String(idpersona)
                },
            });

            if (updateResult.count === 0) {
                throw new Error('No applications found for the given userId');
            }
        } catch (error) {
            console.error('Error updating quoteSmartItId:', error);
            throw error;
        }
    }
}
