import { GetTaxPersonService } from '@/application/service/GetTaxPersonService'
import { DI } from '@infrastructure'
import container from '@infrastructure/inversify.config'
import { injectable } from 'inversify'
import { PersonUpdateFactory } from '@domain/personUpdate/PersonUpdateFactory'
import { PersonUpdateEntity } from '@domain/personUpdate/PersonUpdateEntity'

interface TaxPdfPerson {
  idPdf: string
}

@injectable()
export class TaxPdfPersonResolver {
  build() {
    return {
      Query: {
        getTaxPdfPerson: this.getTaxPdfPerson,
      },
    }
  }

  getTaxPdfPerson = async (_parent: unknown, { idPdf }: TaxPdfPerson): Promise<PersonUpdateEntity | null> => {
    const serviceTaxPdf = container.get<GetTaxPersonService>(DI.GetTaxPersonService)
    const entityData = await serviceTaxPdf.getParameters(idPdf)
    const regimenName = entityData.RegimenFiscal.split('-')
    entityData.RegimenFiscal = regimenName[0]
    const updateEntity = PersonUpdateFactory.fromDTO(entityData)
    return updateEntity
  }
}
