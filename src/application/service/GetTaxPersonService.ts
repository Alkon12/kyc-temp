import { DTO } from '@domain/kernel/DTO'
import { TaxPersonEntity } from '@domain/taxPerson/TaxPersonEntity'
import { IPersonUpdate } from '@type/IPersonUpdate'

export interface GetTaxPersonService {
  getParameters(idPdf: string): Promise<DTO<IPersonUpdate>>
}
