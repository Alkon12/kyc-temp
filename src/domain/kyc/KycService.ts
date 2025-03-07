import { UUID } from '@domain/shared/UUID'
import { KycOverviewResponse } from './interfaces/KycOverviewResponse'
import { AddressEntity } from '@domain/address/AddressEntity'
import { UserId } from '@domain/user/models/UserId'
import { StringValue } from '@domain/shared/StringValue'

export default abstract class AbstractKycService {
  abstract overview(): Promise<KycOverviewResponse>
  abstract setKycAddress(userId: UserId, taskId: UUID, address: AddressEntity): Promise<AddressEntity>
  abstract setInactivityStatement(userId: UserId, taskId: UUID, reason: StringValue): Promise<Boolean>
}
