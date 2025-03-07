import { GetScrapingTaxPersonService } from '@/application/service/GetScrapingTaxPersonServic'
import { injectable } from 'inversify'

@injectable()
export class GetScrapingTaxPerson implements GetScrapingTaxPersonService {
  get(url: string): Promise<string> {
    throw new Error('Method not implemented.')
  }
}
