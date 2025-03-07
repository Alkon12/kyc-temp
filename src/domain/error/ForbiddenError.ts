import { DomainError, DomainErrorArgs } from './DomainError'
import { ErrorCode } from './ErrorCode'

export class ForbiddenError extends DomainError {
  constructor(params: string | DomainErrorArgs) {
    console.error('FORBIDDEN ERROR: ', params)
    super({ code: ErrorCode.forbidden, ...DomainError.createError(params) })
  }
}
