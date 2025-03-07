import { inject, injectable } from 'inversify';
import { DI } from '@infrastructure';
import AbstractContractSigningService from '@domain/contractSigning/AbstractContractSigningService';
import { ContractSigningEntity } from '@domain/contractSigning/ContractSigningEntity';
import { ContractSigningFactory } from '@domain/contractSigning/ContractSigningFactory';

import AbstractContractService from '@domain/contract/AbstractContractService';

@injectable()
export class ContractSigningResolvers {
    constructor(
        //@inject(DI.ContractSigningService)
        //private readonly contractSigningService: AbstractContractSigningService
        @inject(DI.ContractService)
        private readonly contractService: AbstractContractService
    ) {}

    build() {
        return {
            Mutation: {
                signContract: this.signContract,
            },
        };
    }
    private signContract = async (
        _parent: unknown,
        { idsmartIt, IdContrato }: { idsmartIt: string; IdContrato: number; }
    ): Promise<ContractSigningEntity | null> => {
        const result = await this.contractService.sign(idsmartIt, IdContrato);
    
        if (result && result.Id) {
            return ContractSigningFactory.fromDTO(result.Id); 
        }
    
        return null;
    };
    
}
