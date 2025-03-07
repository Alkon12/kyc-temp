import { ContractEntity } from './ContractEntity';
import { ContractSigningEntity } from '@domain/contractSigning/ContractSigningEntity';

export default abstract class AbstractContractService {
    abstract generateContract(
        idsmartIt: string,
        IdCotizacion: string,
        contractDate: Date,
        deliveryLocationId: number
    ): Promise<ContractEntity | null>;
    abstract getById(contractId: number): Promise<ContractEntity | null>
    abstract sign(idsmarIt: string, contractId: number): Promise<ContractSigningEntity | null>
}
