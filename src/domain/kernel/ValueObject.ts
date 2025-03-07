import dayjs, { Dayjs } from 'dayjs'
import { DTO, serialize } from './DTO'
import { Entity } from './Entity'

export type ValueDict = {
  [key: string]: ValueObject<unknown, BaseValue> | ValueObject<unknown, BaseValue>[] | undefined | BaseValue
}

export type BaseValue =
  | string
  | string[]
  | number
  | number[]
  | boolean
  | boolean[]
  | Date
  | Date[]
  | Dayjs
  | Dayjs[]
  // Object | // Todo Json
  | ValueDict
  | ValueDict[]

export abstract class ValueObject<Brand, Value extends BaseValue> {
  public $nominal$!: { brand: Brand; type: Value }

  constructor(readonly _value: Value) {}

  sameValueAs(other: Value | this): boolean {
    if (ValueObject.isValueObject(other)) {
      return _deepEqual(this._value, other._value)
    }
    return _deepEqual(this._value, other)
  }

  toDTO(): DTO<this> {
    return serialize(this._value) as DTO<this>
  }

  static isValueObject(obj: unknown): obj is ValueObject<unknown, BaseValue> {
    return obj instanceof ValueObject
  }
}

function _deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true
  } else if (!a || !b || typeof a !== 'object' || typeof b !== 'object') {
    return false
  } else if ((a instanceof Date && b instanceof Date) || (dayjs.isDayjs(a) && dayjs.isDayjs(b))) {
    return a.toISOString() === b.toISOString()
  } else if (ValueObject.isValueObject(a) && ValueObject.isValueObject(b)) {
    return a.sameValueAs(b)
  } else if (Entity.isEntity(a) && Entity.isEntity(b)) {
    return a.sameIdentityAs(b)
  }

  const keys = Object.keys(a as Dict)
  if (keys.length !== Object.keys(b as Dict).length) {
    return false
  }
  return keys.every((key) => _deepEqual((a as Dict)[key], (b as Dict)[key]))
}
