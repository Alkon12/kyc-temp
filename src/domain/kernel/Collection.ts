import { BaseValue, ValueObject } from './ValueObject'

export type CollectionKey = ValueObject<unknown, BaseValue> | null | undefined
export type CollectionItem<T = unknown> = {
  key: CollectionKey
  value: T
}

export class Collection<T = unknown> {
  private _data: CollectionItem<T>[] = []

  private _compare(a: CollectionKey, b: CollectionKey): boolean {
    if (a === null || a === undefined) {
      return b === null || b === undefined
    }
    return !!b && a.sameValueAs(b)
  }

  private _get(key: CollectionKey): CollectionItem<T> | undefined {
    return this._data.find((item) => this._compare(item.key, key))
  }

  get length(): number {
    return this._data.length
  }

  clear(): void {
    this._data = []
  }

  delete(key: CollectionKey): boolean {
    for (let i = 0; i < this._data.length; i++) {
      if (this._compare(this._data[i].key, key)) {
        this._data.splice(i, 1)
        return true
      }
    }
    return false
  }

  get(key: CollectionKey): T | undefined {
    const item = this._get(key)
    return item?.value
  }

  has(key: CollectionKey): boolean {
    return !!this._get(key)
  }

  set(key: CollectionKey, value: T): this {
    const item = this._get(key)
    if (item !== undefined) {
      item.value = value
    } else {
      this._data.push({ key, value })
    }
    return this
  }
}
