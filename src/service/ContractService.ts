import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import AbstractContractService from '@domain/contract/AbstractContractService'
import type ContractRepository from '@domain/contract/ContractRepository'
import { ContractEntity } from '@domain/contract/ContractEntity'
import { ContractSigningEntity } from '@domain/contractSigning/ContractSigningEntity'

@injectable()
export class ContractService implements AbstractContractService {
  constructor(
    @inject(DI.ContractRepository)
    private readonly contractRepository: ContractRepository,
  ) {}

  async generateContract(
    idsmartIt: string,
    IdCotizacion: string,
    contractDate: Date,
    deliveryLocationId: number,
  ): Promise<ContractEntity | null> {
    return this.contractRepository.generateContract(idsmartIt, IdCotizacion, contractDate, deliveryLocationId)
  }

  async getById(contractId: number): Promise<ContractEntity | null> {
    return this.contractRepository.getById(contractId)
  }

  async sign(idsmarIt: string, contractId: number): Promise<ContractSigningEntity | null> {
    return this.contractRepository.sign(idsmarIt, contractId)
  }
}
