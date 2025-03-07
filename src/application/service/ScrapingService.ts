import { IPersonUpdate } from '@type/IPersonUpdate'

export interface ScrapingService {
  Get(url: string, uuid: string): Promise<IPersonUpdate>
}
