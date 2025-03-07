import { PendingDocumentsEntity } from './PendingDocumentsEntity';

export default abstract class AbstractPendingDocumentsService {
    abstract fetchPendingDocuments(numeroDeSerie: string): Promise<PendingDocumentsEntity[]>;
}
