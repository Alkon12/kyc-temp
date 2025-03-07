import { ContractSigningEntity } from './ContractSigningEntity';

export default interface ContractSigningRepository {
    signContract(idsmartIt: string, IdContrato: number): Promise<ContractSigningEntity | null>;
}
