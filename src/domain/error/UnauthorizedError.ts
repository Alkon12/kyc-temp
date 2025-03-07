import { DomainError, DomainErrorArgs } from './DomainError'
import { ErrorCode } from './ErrorCode'

export class UnauthorizedError extends DomainError {
  constructor(params: string | DomainErrorArgs) {
    console.error('UNAUTHORIZED ERROR: ', params)
    super({ code: ErrorCode.unauthorized, ...DomainError.createError(params) })
  }
}
