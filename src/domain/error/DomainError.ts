import { ErrorCode } from './ErrorCode'

interface DomainErrorPayloadArgs {
  message?: string
  code?: ErrorCode | string
  payload?: unknown
}

export type DomainErrorArgs = string | DomainErrorPayloadArgs

export interface DomainErrorConstructorArgs {
  message?: string
  code: ErrorCode | string
  payload?: unknown
}

export abstract class DomainError extends Error {
  protected constructor(readonly params: DomainErrorConstructorArgs) {
    super(params.message)

    this.name = this.constructor.name
  }

  protected static createError(params: DomainErrorArgs): DomainErrorPayloadArgs {
    if (typeof params === 'string') {
      return {
        message: params,
      }
    }

    return params
  }
}
