import { VerificationLinkEntity } from './models/VerificationLinkEntity'
import { VerificationLinkId } from './models/VerificationLinkId'
import { UUID } from '@domain/shared/UUID'
import { StringValue } from '@domain/shared/StringValue'

export default interface VerificationLinkRepository {
  getById(verificationLinkId: VerificationLinkId): Promise<VerificationLinkEntity>
  getByToken(token: StringValue): Promise<VerificationLinkEntity>
  getByVerificationId(verificationId: UUID): Promise<VerificationLinkEntity[]>
  create(verificationLink: VerificationLinkEntity): Promise<VerificationLinkEntity>
  save(verificationLink: VerificationLinkEntity): Promise<VerificationLinkEntity>
} 