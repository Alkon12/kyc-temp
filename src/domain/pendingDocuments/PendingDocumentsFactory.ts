import { PendingDocumentsEntity } from './PendingDocumentsEntity';

export class PendingDocumentsFactory {
    public static fromDTO(data: any): PendingDocumentsEntity {
        return PendingDocumentsEntity.fromDTO(data);
    }

    public static toDTO(entity: PendingDocumentsEntity): any {
        return entity.toDTO();
    }
}
