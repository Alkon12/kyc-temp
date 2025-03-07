import { ProspectEntity } from '@/domain/prospect/ProspectEntity'
import { UUID } from '@domain/shared/UUID'
import { UserId } from '@domain/user/models/UserId'
import { ProspectActivityEntity } from './ProspectActivityEntity'
import { ProspectStatusEntity } from './ProspectStatusEntity'
import { ProspectStatusId } from './models/ProspectStatusId'
import { StringValue } from '@domain/shared/StringValue'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { DateTimeValue } from '@domain/shared/DateTime'

export type ProspectRepositoryGetAllFilters = {
  prospectStatusId?: ProspectStatusId[]
  search?: StringValue
  supportUserId?: UserId[]
  withApplication?: BooleanValue
  withQuotes?: BooleanValue
  withoutAssignedSupportUser?: BooleanValue
  updatedBefore?: DateTimeValue
}

export default interface ProspectRepository {
  create(prospect: ProspectEntity): Promise<ProspectEntity>
  save(prospect: ProspectEntity): Promise<ProspectEntity>
  getById(prospectId: UUID): Promise<ProspectEntity | null>
  getByUser(userId: UserId): Promise<ProspectEntity | null>
  getAll(filters?: ProspectRepositoryGetAllFilters): Promise<ProspectEntity[]>
  getActivity(prospectId: UUID): Promise<ProspectActivityEntity[]>
  getProspectStatusList(): Promise<ProspectStatusEntity[]>
}
