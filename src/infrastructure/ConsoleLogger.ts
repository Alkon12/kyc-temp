import { LoggingModule, LoggingService } from '@/application/service/LoggingService'
import { injectable } from 'inversify'

@injectable()
export class ConsoleLogger implements LoggingService {
  log(module: LoggingModule, ...data: unknown[]): void {
    if (module === LoggingModule.AUTH && process.env.AUTH_DEBUG_ENABLED != '1') {
      return
    }

    console.log(module.toUpperCase(), ...data)
  }

  error(module: LoggingModule, ...data: unknown[]): void {
    if (module === LoggingModule.AUTH && process.env.AUTH_DEBUG_ENABLED != '1') {
      return
    }

    console.error(...data)
  }

  warn(...data: unknown[]): void {
    console.warn(...data)
  }

  info(...data: unknown[]): void {
    console.info(...data)
  }

  debug(...data: unknown[]): void {
    console.debug(...data)
  }
}
