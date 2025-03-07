import { UUID } from '@domain/shared/UUID'
import { ProspectActivityEntity } from './ProspectActivityEntity'

export default interface ProspectActivityRepository {
  create(prospect: ProspectActivityEntity): Promise<ProspectActivityEntity[]>
  getByProspect(prospectId: UUID): Promise<ProspectActivityEntity[]>
}
