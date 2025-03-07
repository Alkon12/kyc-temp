import { PendingDocumentsEntity } from './PendingDocumentsEntity';

export default abstract class PendingDocumentsRepository {
    abstract fetchPendingDocuments(numeroDeSerie: string): Promise<PendingDocumentsEntity[]>;
}
