import { v4 as uuidv4 } from 'uuid'
import { ValidationError } from '@domain/error/ValidationError'
import { ValueObject } from '@domain/kernel/ValueObject'

export abstract class UUIDAbstract<Brand> extends ValueObject<Brand, string> {
  constructor(id?: string) {
    const _id = id ? id : uuidv4()

    // Agregar más información para depuración
    if (!UUIDAbstract.isValid(_id)) {
      throw new ValidationError(`Invalid ID [${id}], must be a UUID (type: ${typeof id}, value: ${id})`)
    }
    super(_id)
  }

  static isValid(uuid: string): boolean {
    const RFC4122 = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i

    return RFC4122.test(uuid)
  }
}
