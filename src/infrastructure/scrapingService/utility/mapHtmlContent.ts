import { CheerioAPI, load } from 'cheerio'

export const mapHtmlContent = (bodyContent: CheerioAPI, dataClient: DataClientScraping) => {
  // datos personales
  const contentTablePersonalDates = bodyContent('form').children('ul').eq(1).html() ?? ''
  const htmlTablePersonalDates = load(contentTablePersonalDates)
  //   console.log(contentTablePersonalDates);
  const contentTablePersonaDatesHtml = htmlTablePersonalDates('table tbody').html() ?? ''
  const contentTablePersonaDates = load(contentTablePersonaDatesHtml)
  contentTablePersonaDates('tbody tr').each((index, row) => {
    const cells = contentTablePersonaDates(row).find('td')
    const key = cells.eq(0).text().trim()
    const value = cells.eq(1).text().trim()
    const arrayValues = key.split(':')
    if (arrayValues[0] in dataClient) dataClient[arrayValues[0]] = value
  })

  // datos domiciliarios
  const contentAdrress = bodyContent('form').children('ul').eq(2).html() ?? ''
  const htmlAdrress = load(contentAdrress)
  const contentTableAdrressHtml = htmlAdrress('table tbody').html() ?? ''
  const contentTablaAdrress = load(contentTableAdrressHtml)
  contentTablaAdrress('tbody tr').each((index, row) => {
    const cells = contentTablaAdrress(row).find('td')
    const key = cells.eq(0).text().trim()
    const value = cells.eq(1).text().trim()
    const arrayValues = key.split(':')
    if (arrayValues[0] in dataClient) dataClient[arrayValues[0]] = value
  })

  // datos fiscales
  const contentFiscal = bodyContent('form').children('ul').eq(3).html() ?? ''
  const htmlFiscal = load(contentFiscal)
  const contentTableFiscalHtml = htmlFiscal('table tbody').html() ?? ''
  const contentTablaFiscal = load(contentTableFiscalHtml)
  contentTablaFiscal('tbody tr').each((index, row) => {
    const cells = contentTablaFiscal(row).find('td')
    const key = cells.eq(0).text().trim()
    const value = cells.eq(1).text().trim()
    const arrayValues = key.split(':')
    if (arrayValues[0] in dataClient) dataClient.Régimen = [...dataClient.Régimen, value]
  })
}
