import { DTO, serialize } from './DTO'
import { BaseValue, ValueObject } from './ValueObject'

/**
 * TODO: In order to do proper DDD immutability we need to remove arrays from the BaseProps
 */
export type BaseProps = {
  id?: ValueObject<unknown, BaseValue>
  [key: string]:
    | ValueObject<unknown, BaseValue>
    | ValueObject<unknown, BaseValue>[]
    | Entity<unknown, BaseProps>
    | Entity<unknown, BaseProps>[]
    | string
    | string[]
    | undefined
}

export abstract class Entity<Brand, Props extends BaseProps> {
  public $nominal$!: { brand: Brand; type: Props }

  constructor(protected _props: Props) {}

  sameIdentityAs(other: this): boolean {
    if (this._props.id === undefined || other._props.id === undefined) {
      return false
    }
    return this._props.id.sameValueAs(other._props.id)
  }

  toDTO(): DTO<this> {
    return serialize(this._props) as DTO<this>
  }

  static isEntity(obj: unknown): obj is Entity<unknown, BaseProps> {
    return obj instanceof Entity
  }
}
