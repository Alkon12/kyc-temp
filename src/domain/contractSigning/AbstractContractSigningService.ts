import { ContractSigningEntity } from './ContractSigningEntity';

export default abstract class AbstractContractSigningService {
    abstract signContract(
        idsmartIt: string,
        IdContrato: number
    ): Promise<ContractSigningEntity | null>;
}
