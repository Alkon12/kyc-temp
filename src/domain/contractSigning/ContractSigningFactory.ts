import { ContractSigningEntity } from './ContractSigningEntity';

export class ContractSigningFactory {
    public static fromDTO(id: string): ContractSigningEntity {
        return new ContractSigningEntity(id);
    }
}