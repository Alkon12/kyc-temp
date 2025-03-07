import { LeadEntity } from '@/domain/lead/LeadEntity'
import { BooleanValue } from '../shared/BooleanValue'
import { UUID } from '@domain/shared/UUID'

export default interface LeadRepository {
  create(data: LeadEntity): Promise<BooleanValue>
  update(data: LeadEntity): Promise<BooleanValue>
  getAll(): Promise<LeadEntity[]>
  getById(leadId: UUID): Promise<LeadEntity | null>
}
