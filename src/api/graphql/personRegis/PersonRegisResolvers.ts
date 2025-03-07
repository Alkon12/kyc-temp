import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import { PersonRegisEntity } from '@domain/onBoarding/PersonRegisEntity'
import { PersonRegisService } from '@service/PersonRegisService'
import { StringValue } from '@domain/shared/StringValue'
import { MutationCreatePersonRegiArgs } from '../app.schema.gen'

@injectable()
export class PersonRegisResolvers {
  build() {
    return {
      Mutation: {
        createPersonRegi: this.createPersonRegi,
      },
    }
  }

  createPersonRegi = async (
    _parent: unknown,
    { Nombre, ApellidoPaterno, ApellidoMaterno, NumeroCelular, idGUID, Email }: MutationCreatePersonRegiArgs,
  ): Promise<DTO<PersonRegisEntity | null>> => {
    const personRegisService = container.get<PersonRegisService>(DI.PersonRegisService)
    const reg = await personRegisService.RegisPerson(
      Nombre,
      ApellidoPaterno,
      ApellidoMaterno,
      NumeroCelular,
      idGUID,
      Email,
    )

    return reg
  }
}
