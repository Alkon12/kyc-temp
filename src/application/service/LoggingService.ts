export interface LoggingService {
  log(module: LoggingModule, ...data: unknown[]): void
  error(module: LoggingModule, ...data: unknown[]): void
  warn(...data: unknown[]): void
  info(...data: unknown[]): void
  debug(...data: unknown[]): void
}

export enum LoggingModule {
  GENERAL = 'GENERAL',
  AUTH = 'AUTH',
}
