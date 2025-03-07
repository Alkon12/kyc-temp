import { ContractEntity } from './ContractEntity';
import { ContractSigningEntity } from '@domain/contractSigning/ContractSigningEntity';

export default interface ContractRepository {
    getById(contractId: number): Promise<ContractEntity | null>
    generateContract(idsmartIt: string, IdCotizacion: string, contractDate: Date, deliveryLocationId: number): Promise<ContractEntity | null>
    sign(idsmartIt: string, contractId: number): Promise<ContractSigningEntity | null>
}
