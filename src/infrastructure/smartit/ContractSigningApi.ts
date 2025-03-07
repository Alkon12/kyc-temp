import { injectable } from 'inversify';
import fetch from 'node-fetch';
import { ContractSigningEntity } from '@domain/contractSigning/ContractSigningEntity';
import ContractSigningRepository from '@domain/contractSigning/ContractSigningRepository';
import { ContractSigningFactory } from '@domain/contractSigning/ContractSigningFactory';

@injectable()
export class ContractSigningApi implements ContractSigningRepository {
    async signContract(idsmartIt: string, IdContrato: number): Promise<ContractSigningEntity | null> {
        const url = `${process.env.NEXT_PUBLIC_URL_SMARTIT}contrato/firmar`;
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idsmartIt}`
            },
            body: JSON.stringify({
                IdContrato: IdContrato
            })
        };

        const response = await fetch(url, options);
        const result = await response.json();
        if (result && result.Message) {
            throw new Error(result.Message || 'Error signing contract');
        }

        return ContractSigningFactory.fromDTO(result);
    }
}
