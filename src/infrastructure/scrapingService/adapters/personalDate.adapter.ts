import { ARRAY_INITIAL_DATACLIENT_SCRAPING } from '../type/scraping.const'

export const personalDate = (arrayString: string[]) => {
  const dataClient = ARRAY_INITIAL_DATACLIENT_SCRAPING

  if (arrayString)
    arrayString.map((item) => {
      const indexValue = arrayString.indexOf(item)
      if (item in dataClient) dataClient[item] = arrayString[indexValue + 1]
      return dataClient
    })
  return ARRAY_INITIAL_DATACLIENT_SCRAPING
}
