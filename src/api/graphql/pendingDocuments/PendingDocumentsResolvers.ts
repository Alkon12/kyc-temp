import { inject, injectable } from 'inversify';
import { DI } from '@infrastructure';
import { PendingDocumentsEntity } from '@domain/pendingDocuments/PendingDocumentsEntity';
import AbstractPendingDocumentsService from '@domain/pendingDocuments/AbstractPendingDocumentsService';

@injectable()
export class PendingDocumentsResolvers {
    constructor(
        @inject(DI.PendingDocumentsService)
        private readonly pendingDocumentsService: AbstractPendingDocumentsService
    ) {}

    build() {
        return {
            Query: {
                fetchPendingDocuments: this.fetchPendingDocuments,
            },
        };
    }

    private fetchPendingDocuments = async (
        _parent: unknown,
        { numeroDeSerie }: { numeroDeSerie: string }
    ): Promise<PendingDocumentsEntity[]> => {
        return this.pendingDocumentsService.fetchPendingDocuments(numeroDeSerie);
    };
}
