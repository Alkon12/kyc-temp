import { inject, injectable } from 'inversify';
import  AbstractContractService  from '@domain/contract/AbstractContractService';
import { DI } from '@infrastructure';

@injectable()
export class ContractResolvers {
    constructor(
        @inject(DI.ContractService) 
        private readonly contractService: AbstractContractService
    ) {}

    build() {
        return {
            Mutation: {
                generateContract: this.generateContract,
            },
        };
    }

    private generateContract = async (
        _parent: unknown,
        { idsmartIt, IdCotizacion, contractDate, deliveryLocationId }: { idsmartIt: string; IdCotizacion: string,  contractDate: Date, deliveryLocationId: number }
    ): Promise<any> => {
        const result = await this.contractService.generateContract(idsmartIt, IdCotizacion, contractDate, deliveryLocationId );
        return result ? result.toDTO() : null;
    };
}
