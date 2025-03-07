import { injectable, inject } from 'inversify'
import { DI } from '@infrastructure'
import AbstractPersonUpdateService from '@domain/personUpdate/PersonUpdateService'
import type PersonUpdateRepository from '@domain/personUpdate/PersonUpdateRepository'
import { PersonUpdateEntity } from '@domain/personUpdate/PersonUpdateEntity'
import { IPersonUpdate } from '@type/IPersonUpdate'
import { DTO } from '@domain/kernel/DTO'

@injectable()
export class PersonUpdateService implements AbstractPersonUpdateService {
  constructor(
    @inject(DI.PersonUpdateRepository)
    private readonly personUpdateRepository: PersonUpdateRepository,
  ) {}

  async updatePerson(data: DTO<IPersonUpdate>): Promise<DTO<PersonUpdateEntity> | null> {
    return this.personUpdateRepository.updatePerson(data)
  }
}
