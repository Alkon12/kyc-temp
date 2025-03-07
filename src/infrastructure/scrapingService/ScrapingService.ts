import { ScrapingService } from '@/application/service/ScrapingService'
import { injectable } from 'inversify'
import { load } from 'cheerio'
import { ARRAY_INITIAL_DATACLIENT_SCRAPING } from './type/scraping.const'
import { mapHtmlContent } from './utility/mapHtmlContent'
import { personUpdateDto } from './adapters/personUpdateDto'
import { IPersonUpdate } from '@type/IPersonUpdate'

@injectable()
export class Scraping implements ScrapingService {
  async Get(url: string, uuid: string): Promise<IPersonUpdate> {
    const dataClient = ARRAY_INITIAL_DATACLIENT_SCRAPING

    const response = await fetch(url)
    const data = await response.text()
    const $xml = load(data, { xmlMode: true })
    //   console.log(data);
    const html = $xml('html').html() ?? ''
    const bodyContent = load(html)

    mapHtmlContent(bodyContent, dataClient)
    return personUpdateDto(dataClient, uuid)
  }
}
