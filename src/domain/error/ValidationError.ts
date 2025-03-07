import { DomainError, DomainErrorArgs } from './DomainError'
import { ErrorCode } from './ErrorCode'

export class ValidationError extends DomainError {
  constructor(params: string | DomainErrorArgs) {
    console.error('VALIDATION ERROR: ', params)
    super({ code: ErrorCode.validation, ...DomainError.createError(params) })
  }
}
