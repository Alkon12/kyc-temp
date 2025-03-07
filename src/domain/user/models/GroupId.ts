import { ValueObject } from '@domain/kernel/ValueObject'
import { ValidationError } from '@domain/error/ValidationError'

export const TASK_TYPES = {
  BACKOFFICE: 'BACKOFFICE',
  DRIVER: 'DRIVER',
  MANAGER: 'MANAGER',
}

export class GroupId extends ValueObject<'GroupId', string> {
  constructor(value: string) {
    const valid = Object.values(TASK_TYPES)
    if (!valid.includes(value)) {
      throw new ValidationError(`Invalid Group Id [${value}], must be one of "${valid.join()}"`)
    }
    super(value)
  }

  static get(value: GroupId | string): GroupId {
    return typeof value === 'string' ? new GroupId(value) : value
  }

  static BACKOFFICE = new GroupId(TASK_TYPES.BACKOFFICE)
  static DRIVER = new GroupId(TASK_TYPES.DRIVER)
  static MANAGER = new GroupId(TASK_TYPES.MANAGER)
}
