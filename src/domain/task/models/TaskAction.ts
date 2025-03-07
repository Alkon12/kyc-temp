import { ValueObject } from '@domain/kernel/ValueObject'
import { ValidationError } from '@domain/error/ValidationError'

const values = {
  DEFAULT: 'DEFAULT',
  ACCEPT: 'ACCEPT',
  DECLINE: 'DECLINE',
  DISMISS: 'DISMISS',
}

export class TaskAction extends ValueObject<'TaskAction', string> {
  constructor(value: string) {
    const valid = Object.values(values)
    if (!valid.includes(value)) {
      throw new ValidationError(`Invalid TaskAction [${value}], must be one of "${valid.join()}"`)
    }
    super(value)
  }

  static DEFAULT = new TaskAction(values.DEFAULT)
  static ACCEPT = new TaskAction(values.ACCEPT)
  static DECLINE = new TaskAction(values.DECLINE)
  static DISMISS = new TaskAction(values.DISMISS)
}
