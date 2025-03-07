import { BooleanValue } from '@domain/shared/BooleanValue'
import { LeadEntity, LeadEntityProps } from './LeadEntity'
import { DTO } from '@domain/kernel/DTO'
import { UUID } from '@domain/shared/UUID'
import { CreateLeadArgs } from './interfaces/CreateLeadArgs'
import { LeadOverviewResponse } from './interfaces/LeadOverviewResponse'

export default abstract class AbstractLeadService {
  abstract create(props: DTO<CreateLeadArgs>): Promise<BooleanValue>
  abstract update(props: DTO<LeadEntityProps>): Promise<BooleanValue>
  abstract getAll(): Promise<LeadEntity[]>
  abstract getActive(): Promise<LeadEntity[]>
  abstract getById(leadId: UUID): Promise<LeadEntity | null>
  abstract overview(): Promise<LeadOverviewResponse>
}
