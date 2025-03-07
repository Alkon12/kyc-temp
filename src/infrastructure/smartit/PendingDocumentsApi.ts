import { injectable } from 'inversify';
import fetch from 'node-fetch';
import { PendingDocumentsEntity } from '@domain/pendingDocuments/PendingDocumentsEntity';
import PendingDocumentsRepository from '@domain/pendingDocuments/PendingDocumentsRepository';
import { PendingDocumentsFactory } from '@domain/pendingDocuments/PendingDocumentsFactory';

@injectable()
export class PendingDocumentsApi implements PendingDocumentsRepository {
    private readonly VEHICLE_INFO_URL: string = `${process.env.NEXT_PUBLIC_URL_SMARTIT}cotizaciones`;
    private readonly DOCUMENTS_URL: string = `${process.env.NEXT_PUBLIC_URL_SMARTIT}expedientedigital/documentos-pendientes`;

    async fetchPendingDocuments(numeroDeSerie: string): Promise<PendingDocumentsEntity[]> {
        const vehicleInfoUrl = `${this.VEHICLE_INFO_URL}/${numeroDeSerie}/vehiculo`;
        const vehicleResponse = await fetch(vehicleInfoUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${"dd8b5b17-a4df-41a5-94e5-36460eb65f71"}`
            }
        });

        const vehicleResult = await vehicleResponse.json();

        if (!vehicleResult || !vehicleResult.NumeroSerie) {
            throw new Error('Error fetching vehicle information');
        }

        const documentsUrlWithParams = `${this.DOCUMENTS_URL}?NumeroDeSerie=${encodeURIComponent(vehicleResult.NumeroSerie)}`;
        try{
            const documentsResponse = await fetch(documentsUrlWithParams, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${"dd8b5b17-a4df-41a5-94e5-36460eb65f71"}`
                },
            });

            const documentsResult = await documentsResponse.json();
            if (!documentsResult) {
                throw new Error('Error fetching pending documents');
            }

            return documentsResult.map((item: any) => PendingDocumentsFactory.fromDTO(item));
        } catch(error) {
            throw error;
        }

        
    }
}