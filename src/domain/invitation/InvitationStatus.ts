import { ValidationError } from '@domain/error/ValidationError'
import { ValueObject } from '@domain/kernel/ValueObject'

const values = {
  CREATED: 'CREATED',
  SENT: 'SENT',
  ACCEPTED: 'ACCEPTED',
  EXPIRED: 'EXPIRED',
}

export class InvitationStatus extends ValueObject<'InvitationStatus', string> {
  constructor(value: string) {
    const valid = Object.values(values)
    if (!valid.includes(value)) {
      throw new ValidationError(`Invalid InvitationStatus [${value}], must be one of "${valid.join()}"`)
    }
    super(value)
  }

  static CREATED = new InvitationStatus(values.CREATED)
  static SENT = new InvitationStatus(values.SENT)
  static ACCEPTED = new InvitationStatus(values.ACCEPTED)
  static EXPIRED = new InvitationStatus(values.EXPIRED)
}
