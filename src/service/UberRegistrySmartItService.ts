import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import AbstractUberRegistrySmartItService from '@domain/uberRegistrySmartIt/AbstractUberRegistrySmartItService'
import type UberRegistrySmartItRepository from '@domain/uberRegistrySmartIt/UberRegistrySmartItRepository'
import { UberRegistrySmartItEntity } from '@domain/uberRegistrySmartIt/UberRegistrySmartItEntity'

@injectable()
export class UberRegistrySmartItService extends AbstractUberRegistrySmartItService {
  constructor(
    @inject(DI.UberRegistrySmartItRepository)
    private readonly uberRegistrySmartItRepository: UberRegistrySmartItRepository,
  ) {
    super()
  }

  async getUberRegistryByUserId(userId: string): Promise<UberRegistrySmartItEntity | null> {
    return this.uberRegistrySmartItRepository.getUberRegistryByUserId(userId)
  }
}
