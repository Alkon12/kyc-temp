import { DomainError, DomainErrorArgs } from './DomainError'
import { ErrorCode } from './ErrorCode'

export class NotFoundError extends DomainError {
  constructor(params: string | DomainErrorArgs) {
    console.error('NOT FOUND ERROR: ', params)
    super({ code: ErrorCode.notFound, ...DomainError.createError(params) })
  }
}
