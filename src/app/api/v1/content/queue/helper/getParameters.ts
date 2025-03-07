import { arrayHeaderHard, arrayHeadersEasy, INITIAL_DATA_CLIENT, regimenArraySearch } from '../type/queue.const'
import { DataClientType } from '../type/queue.type'
import { myObjectFunction } from './functionObject'

export const getParameters = (jsonData: string) => {
  const arrayStruct = jsonData.split('\n').filter((item) => item)
  const dataClient: DataClientType = INITIAL_DATA_CLIENT
  for (let item of arrayStruct) {
    const value = item.split(':')
    if (/\:/.test(item)) {
      const valueId = arrayStruct.indexOf(item)
      if (arrayHeadersEasy.includes(value[0]))
        if (value[0] in dataClient) dataClient[value[0]] = value[1].trim()
        else if (arrayHeaderHard.includes(value[0])) {
          const valueArrayFind = arrayHeaderHard.find((item) => item.includes(value[0])) ?? ''
          if (valueArrayFind.replaceAll(' ', '') in myObjectFunction)
            myObjectFunction[valueArrayFind.replaceAll(' ', '')](dataClient, value, arrayStruct[valueId + 2])
        }
    }
    if (regimenArraySearch[0] === value[0]) {
      dataClient[regimenArraySearch[0]] = []
      const indexRegimen = arrayStruct.indexOf(item)
      for (let i = indexRegimen + 1; i <= arrayStruct.length; i++) {
        if (/\:/.test(item)) {
          const searchColon = arrayStruct[i].split(':')
          if (searchColon[0] === regimenArraySearch[1]) break
        }
        dataClient['Regímenes'].push(arrayStruct[i])
      }
    }
  }

  dataClient[regimenArraySearch[0]] = dataClient['Regímenes'].filter((item) => item !== regimenArraySearch[2])

  return dataClient
}

getParameters('')
