import { DTO } from '@domain/kernel/DTO'

type NullWithUndefined<T> = T extends null
  ? undefined
  : T extends Date
    ? T
    : {
        [K in keyof T]: T[K] extends (infer U)[] ? NullWithUndefined<U>[] : NullWithUndefined<T[K]>
      }

// TODO convert dates recursively in joined subobjects
export function convertPrismaToDTO<T>(obj: Object): DTO<T> {
  const res = Object.fromEntries(
    Object.entries(obj as Object).map(([k, v]) => {
      if (typeof v === 'object' && v instanceof Date) {
        v = v.toISOString()
      }
      // else if(typeof v === 'object') {
      //   return convertPrismaToDTO(v)
      // }

      return [k, v]
    }),
  )

  return nullsToUndefined(res) as DTO<T>
}

export function nullsToUndefined<T>(obj: T): NullWithUndefined<T> {
  if (obj === null) {
    return undefined as any
  }

  // object check based on: https://stackoverflow.com/a/51458052/6489012
  if (obj?.constructor.name === 'Object') {
    for (let key in obj) {
      obj[key] = nullsToUndefined(obj[key]) as any
    }
  }
  return obj as any
}
