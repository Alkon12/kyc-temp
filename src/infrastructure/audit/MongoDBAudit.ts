import { AuditService } from '@/application/service/AuditService'
import { injectable } from 'inversify'

@injectable()
export class MongoDBAudit implements AuditService {
  audit(...data: unknown[]): void {
    console.log('AUDIT', ...data)
  }
}
