import dayjs, { Dayjs } from 'dayjs'
import { BaseProps, Entity } from './Entity'
import { BaseValue, ValueObject } from './ValueObject'

export type DomainObject = ValueObject<unknown, BaseValue> | Entity<unknown, BaseProps>

export type DTO<T> = T extends object
  ? T extends Date | Dayjs
    ? string
    : T extends DomainObject
      ? DTO<T['$nominal$']['type']>
      : { [key in keyof T]: DTO<T[key]> }
  : T extends string
    ? string
    : T extends number
      ? number
      : T

export function serialize(obj: unknown): unknown {
  if (!obj || typeof obj !== 'object') {
    return obj
  } else if (Array.isArray(obj)) {
    return obj.map((item) => serialize(item))
  } else if (obj instanceof Date || dayjs.isDayjs(obj)) {
    return obj.toISOString()
  } else if (ValueObject.isValueObject(obj) || Entity.isEntity(obj)) {
    return obj.toDTO()
  }

  const dto: Dict = {}
  Object.keys(obj as Dict).forEach((key) => (dto[key] = serialize((obj as Dict)[key])))
  return dto
}
