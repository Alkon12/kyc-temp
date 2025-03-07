import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import { StringValue } from '@domain/shared/StringValue'
import type PersonRegiRepository from '@domain/onBoarding/PersonRegiRepository'
import { PersonRegisEntity } from '@domain/onBoarding/PersonRegisEntity'
import AbstractPersonRegiService from '@domain/onBoarding/PersonRegiService'

@injectable()
export class PersonRegisService implements AbstractPersonRegiService {
  @inject(DI.PersonRegiRepository) private readonly _personRepository!: PersonRegiRepository

  async RegisPerson(
    Nombre: DTO<StringValue>,
    ApellidoPaterno: DTO<StringValue>,
    ApellidoMaterno: DTO<StringValue>,
    NumeroCelular: DTO<StringValue>,
    idGUID: DTO<StringValue>,
    Email: DTO<StringValue>,
  ): Promise<DTO<PersonRegisEntity> | null> {
    const reg = await this._personRepository.RegisPerson(
      new StringValue(Nombre),
      new StringValue(ApellidoPaterno),
      new StringValue(ApellidoMaterno),
      new StringValue(NumeroCelular),
      new StringValue(idGUID),
      new StringValue(Email),
    )

    return reg && reg.toDTO()
  }
}
