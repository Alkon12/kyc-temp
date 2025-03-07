import { GetTaxPersonService } from '@/application/service/GetTaxPersonService'
import { DTO } from '@domain/kernel/DTO'
import { DI } from '@infrastructure'
import container from '@infrastructure/inversify.config'
import { injectable } from 'inversify'
import { QueryScrapingUrlArgs, TaxPerson } from '../app.schema.gen'
import { ScrapingService } from '@/application/service/ScrapingService'
import { IPersonUpdate } from '@type/IPersonUpdate'
import { PersonUpdateEntity } from '@domain/personUpdate/PersonUpdateEntity'
import AbstractPersonUpdateService from '@domain/personUpdate/PersonUpdateService'
import PersonUpdateRepository from '@domain/personUpdate/PersonUpdateRepository'
import { PersonUpdateFactory } from '@domain/personUpdate/PersonUpdateFactory'

const arrayPerson: TaxPerson[] = [
  {
    idUser: 'pikachu',
    Url: '1199',
  },
  {
    idUser: 'Tortoise',
    Url: '1200',
  },
]

@injectable()
export class TaxPersonResolver {
  build() {
    return {
      Query: {
        scrapingUrl: this.scrapingUrl,
        personList: this.personList,
      },
    }
  }

  personList = (): TaxPerson[] => {
    const taxPersonService = arrayPerson
    return taxPersonService
  } //QueryScrapingUrlArgs

  scrapingUrl = async (
    _parent: unknown,
    { Url, idUser, saveBool }: QueryScrapingUrlArgs,
  ): Promise<PersonUpdateEntity | null> => {
    // get rfc and cif
    const arrayParameters = Url.split('=')[3].split('_')
    const scrapingservice = container.get<ScrapingService>(DI.ScrapingService)
    const data = await scrapingservice.Get(Url, idUser)
    // console.log(data)
    const regimenName = data.RegimenFiscal.split('-')
    data.RegimenFiscal = regimenName[0]
    const updateEntity = PersonUpdateFactory.fromDTO(data)
    updateEntity.RFC = arrayParameters[1] ?? ''
    // Update User
    if (saveBool) {
      const updateUserService = container.get<PersonUpdateRepository>(DI.PersonUpdateRepository)
      updateUserService.updatePerson(data)
    }
    updateEntity.RegimenFiscal = regimenName[1]
    return updateEntity
  }
}
