import { arrayHeaderHard, deleteString } from '../type/queue.const'
import { DataClientType } from '../type/queue.type'

type FunctionMap = {
  [key: string]: (objectValues: DataClientType, value: string[], value2: string) => void
}

export const myObjectFunction: FunctionMap = {
  CódigoPostal: (objectValues: DataClientType, value: string[], value2: string) => {
    objectValues[value[0]] = value[1].replace(deleteString[0], '').trim() ?? ''
    objectValues[deleteString[0]] = value[2].trim() ?? ''
  },
  NombredeVialidad: (objectValues: DataClientType, value: string[], value2: string) => {
    objectValues[value[0]] = value[1].replace(deleteString[1], '').trim() ?? ''
    objectValues[deleteString[1]] = value[2].trim()
  },
  NúmeroInterior: (objectValues: DataClientType, value: string[], value2: string) => {
    if (value.includes(arrayHeaderHard[2])) objectValues[value[0]] = value[1].replace(deleteString[2], '').trim() ?? 0
    else objectValues[arrayHeaderHard[2]] = value[2].trim() ?? 0
    if (value.includes(deleteString[2])) objectValues[deleteString[2]] = value[2].trim() ?? ''
    else objectValues[deleteString[2]] = value[2].trim() ?? ''
  },
  NombredelaLocalidad: (objectValues: DataClientType, value: string[], value2: string) => {
    if (value.some((item) => item === arrayHeaderHard[3]))
      objectValues[value[0]] = value[1].replace(deleteString[3], '').trim() ?? ''
    else objectValues[value[0]] = ''
    if (value.some((item) => item === deleteString[3])) objectValues[deleteString[3]] = value[2].trim() ?? ''
    else objectValues[deleteString[3]] = ''
  },
  NombredelaEntidadFederativa: (objectValues: DataClientType, value: string[], value2: string) => {
    const stringPag = value2.split(' ')[0]
    if (stringPag !== 'Página' && stringPag !== 'Contacto')
      objectValues[value[0]] = `${value[1].replace(deleteString[4] ?? '', '').trim()} ${value2 ?? ''}`
    else objectValues[value[0]] = value[1].replace(deleteString[4], '').trim()
    if (value.some((item) => item === deleteString[4])) objectValues[deleteString[4]] = value[2].trim() ?? ''
    else objectValues[deleteString[4]] = ''
  },
}
