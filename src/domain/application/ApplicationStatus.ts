import { ValidationError } from '@domain/error/ValidationError'
import { ValueObject } from '@domain/kernel/ValueObject'

const values = {
  PREAPPROVE: 'PREAPPROVE',
  KYC_AWAITING_USER_: 'KYC',
  REJECTED: 'REJECTED',
  VEHICLE_PREPARATION: 'VEHICLE_PREPARATION',
  VEHICLE_DELIVERED: 'VEHICLE_DELIVERED',
}

export class ApplicationStatus extends ValueObject<'ApplicationStatus', string> {
  constructor(value: string) {
    const valid = Object.values(values)
    if (!valid.includes(value)) {
      throw new ValidationError(`Invalid ApplicationStatus [${value}], must be one of "${valid.join()}"`)
    }
    super(value)
  }

  static PREAPPROVE = new ApplicationStatus(values.PREAPPROVE)
  static KYC_AWAITING_USER_ = new ApplicationStatus(values.KYC_AWAITING_USER_)
  static REJECTED = new ApplicationStatus(values.REJECTED)
  static VEHICLE_PREPARATION = new ApplicationStatus(values.VEHICLE_PREPARATION)
  static VEHICLE_DELIVERED = new ApplicationStatus(values.VEHICLE_DELIVERED)
}

// - solicitud creada
// - esperando preaprobacion
// - esperando que el usuario empiece a completar la info
// - usuario completando info
// - esperando validacion de la info
// - validando info
// - esperando meet
// - esperando decision final
// - preparando vehiculo
// - vehiculo entregado
// - *solicitud rechazada
