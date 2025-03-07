import { ContentService } from '@/application/service/ContentService'
import { GetTaxPersonService } from '@/application/service/GetTaxPersonService'
import { ContentKey } from '@domain/content/ContentKey'
import { TaxPersonEntity } from '@domain/taxPerson/TaxPersonEntity'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure/inversify.symbols'
import { injectable } from 'inversify'
import { getParametersHelper } from './helpers/getParameters'
import AbstractTaxPersonService from '@domain/taxPerson/TaxPersonService'
import { DTO } from '@domain/kernel/DTO'
import { taxPersonNull } from './adapter/taxPersonAdapter'
import AbstractPersonUpdateService from '@domain/personUpdate/PersonUpdateService'
import { personAdapterUpdate } from './adapter/personAdapater'
import { PersonUpdateFactory } from '@domain/personUpdate/PersonUpdateFactory'
import { IPersonUpdate } from '@type/IPersonUpdate'

@injectable()
export class GetDataTaxPerson implements GetTaxPersonService {
  async getParameters(idPdf: string): Promise<DTO<IPersonUpdate>> {
    const contentKey = new ContentKey(idPdf)
    const contentService = container.get<ContentService>(DI.ContentService)
    const metadataContent = await contentService.content(contentKey)
    // console.log(metadataContent)
    // const taxService = container.get<AbstractTaxPersonService>(DI.TaxPersonService)
    if (metadataContent !== null) {
      const jsonString = JSON.stringify(metadataContent)
      const cif = getParametersHelper(jsonString)
      return personAdapterUpdate(cif)
    }
    return taxPersonNull()
  }
}
