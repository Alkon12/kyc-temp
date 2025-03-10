import { ValidationError } from '@domain/error'
import { ValueObject } from '@domain/kernel/ValueObject'

export const AUTH_PROVIDERS = {
  DATABASE: 'DATABASE',
  IMPERSONATE: 'IMPERSONATE',
}

export class AuthProvider extends ValueObject<'AuthProvider', string> {
  constructor(value: string) {
    const valid = Object.values(AUTH_PROVIDERS)
    if (!valid.includes(value)) {
      throw new ValidationError(`Invalid AuthProvider [${value}], must be one of "${valid.join()}"`)
    }
    super(value)
  }

  static get(value: AuthProvider | string): AuthProvider {
    return typeof value === 'string' ? new AuthProvider(value) : value
  }

  static DATABASE = new AuthProvider(AUTH_PROVIDERS.DATABASE)
  static IMPERSONATE = new AuthProvider(AUTH_PROVIDERS.IMPERSONATE)
}
