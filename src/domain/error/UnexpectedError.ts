import { DomainError, DomainErrorArgs } from './DomainError'
import { ErrorCode } from './ErrorCode'

export class UnexpectedError extends DomainError {
  constructor(params: string | DomainErrorArgs) {
    console.error('UNEXPECTED ERROR: ', params)
    super({ code: ErrorCode.unexpected, ...DomainError.createError(params) })
  }
}
