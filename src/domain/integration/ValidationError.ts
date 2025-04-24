import { DomainError } from '@domain/error/DomainError';

export class ValidationError extends DomainError {
  constructor(message: string, readonly errorCode: string = 'VALIDATION_ERROR') {
    super({ message, code: errorCode });
  }
}

export class ValidationServiceUnavailableError extends ValidationError {
  constructor(message: string = 'Validation service is temporarily unavailable') {
    super(message, 'VALIDATION_SERVICE_UNAVAILABLE');
  }
}

export class ValidationInvalidDataError extends ValidationError {
  constructor(message: string = 'Invalid data provided for validation') {
    super(message, 'VALIDATION_INVALID_DATA');
  }
} 