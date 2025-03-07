import { DomainError, DomainErrorArgs } from './DomainError'
import { ErrorCode } from './ErrorCode'

export class NotImplementedError extends DomainError {
  constructor(params: string | DomainErrorArgs) {
    console.error('NOT IMPLEMENTED ERROR: ', params)
    super({
      code: ErrorCode.notImplemented,
      ...DomainError.createError(params),
    })
  }
}
