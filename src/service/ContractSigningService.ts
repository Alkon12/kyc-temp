import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import type ContractSigningRepository from '@domain/contractSigning/ContractSigningRepository'
import type { ContractSigningEntity } from '@domain/contractSigning/ContractSigningEntity'
import AbstractContractSigningService from '@domain/contractSigning/AbstractContractSigningService'

@injectable()
export class ContractSigningService implements AbstractContractSigningService {
  constructor(
    @inject(DI.ContractSigningRepository)
    private readonly contractSigningRepository: ContractSigningRepository,
  ) {}

  async signContract(idsmartIt: string, IdContrato: number): Promise<ContractSigningEntity | null> {
    return this.contractSigningRepository.signContract(idsmartIt, IdContrato)
  }
}
