import { UserId } from '@domain/user/models/UserId'
import { ProspectOverviewResponse } from './interfaces/ProspectOverviewResponse'
import { ProspectEntity, ProspectEntityProps } from './ProspectEntity'
import { UUID } from '@domain/shared/UUID'
import { StringValue } from '@domain/shared/StringValue'
import { ProspectStatusId } from './models/ProspectStatusId'
import { ProspectActivityEntity } from './ProspectActivityEntity'
import { ProspectStatusEntity } from './ProspectStatusEntity'
import { ProspectActivityTypeId } from './models/ProspectActivityTypeId'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { NumberValue } from '@domain/shared/NumberValue'

export type ProspectUpdateStatusProps = {
  userId: UserId
  prospectId: UUID
  prospectStatusId: ProspectStatusId
  notes?: StringValue
}

export type ProspectAddNoteProps = {
  userId: UserId
  prospectId: UUID
  notes: StringValue
}

export type ProspectReassignSupportUserProps = {
  userId: UserId
  prospectId: UUID
  supportUserId: UserId
  notes?: StringValue
}

export type ProspectLogActivityProps = {
  userId: UserId
  prospectId: UUID
  notes?: StringValue
  prospectActivityTypeId: ProspectActivityTypeId
}

export type ProspectGetAllFilters = {
  tags?: StringValue[]
  search?: StringValue
  supportUserId?: UserId[]
  withApplication?: BooleanValue
  withQuotes?: BooleanValue
  withoutAssignedSupportUser?: BooleanValue
  inactivityInHours?: NumberValue
}

export default abstract class AbstractProspectService {
  abstract getOrCreate(props: Partial<ProspectEntityProps>): Promise<ProspectEntity>
  abstract create(props: Partial<ProspectEntityProps>): Promise<ProspectEntity>
  abstract overview(): Promise<ProspectOverviewResponse>
  abstract getAll(filters: ProspectGetAllFilters): Promise<ProspectEntity[]>
  abstract getByUserId(userId: UserId): Promise<ProspectEntity | null>
  abstract getById(prospectId: UUID): Promise<ProspectEntity | null>
  abstract updateStatus(props: ProspectUpdateStatusProps): Promise<ProspectEntity>
  abstract setActiveApplication(prospectId: UUID, applicationId?: UUID): Promise<ProspectEntity>
  abstract addNote(props: ProspectAddNoteProps): Promise<ProspectActivityEntity[]>
  abstract reassignSupportUser(props: ProspectReassignSupportUserProps): Promise<ProspectEntity>
  abstract logActivity(props: ProspectLogActivityProps): Promise<ProspectActivityEntity[]>
  abstract getAvailableProspectStatusList(prospectId?: UUID): Promise<ProspectStatusEntity[]>
}
