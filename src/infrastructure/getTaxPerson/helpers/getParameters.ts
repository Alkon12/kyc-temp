import { arrayHeaderHard, arrayHeadersEasy, INITIAL_DATA_CLIENT, regimenArraySearch } from '../type/getTaxPerson.const'
import { DataClientType } from '../type/getTaxPerson.type'
import { myObjectFunction } from './funtionObject'

export const getParametersHelper = (jsonData: string) => {
  // console.log(jsonData)
  const arrayStruct = jsonData.split('\\n').filter((item) => item)
  const dataClient: DataClientType = INITIAL_DATA_CLIENT
  for (let item of arrayStruct) {
    // console.log(item)
    const value = item.split(':')
    if (/\:/.test(item)) {
      const valueId = arrayStruct.indexOf(item)
      // console.log(item, arrayStruct.indexOf(item))
      if (arrayHeadersEasy.includes(value[0])) {
        if (value[0] in dataClient) dataClient[value[0]] = value[1].trim()
      } else if (arrayHeaderHard.includes(value[0])) {
        const valueArrayFind = arrayHeaderHard.find((item) => item.includes(value[0])) ?? ''
        // console.log(valueArrayFind.replaceAll(' ', ''))
        if (valueArrayFind.replaceAll(' ', '') in myObjectFunction)
          myObjectFunction[valueArrayFind.replaceAll(' ', '')](dataClient, value, arrayStruct[valueId + 2])
      }
    }
    if (regimenArraySearch[0] === value[0]) {
      dataClient[regimenArraySearch[0]] = []
      // console.log(item)
      const indexRegimen = arrayStruct.indexOf(item)
      for (let i = indexRegimen + 1; i <= arrayStruct.length; i++) {
        if (/\:/.test(arrayStruct[i])) {
          const searchColon = arrayStruct[i].split(':')
          if (searchColon[0] === regimenArraySearch[1]) break
        }
        if (arrayStruct[i] !== regimenArraySearch[3]) dataClient['Regímenes'].push(arrayStruct[i])
        else break
      }
    }
  }

  dataClient[regimenArraySearch[0]] = dataClient['Regímenes'].filter((item) => item !== regimenArraySearch[2])

  // console.log(dataClient)
  return dataClient
}
