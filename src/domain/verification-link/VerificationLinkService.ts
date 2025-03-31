import { VerificationLinkEntity } from './models/VerificationLinkEntity'
import { VerificationLinkId } from './models/VerificationLinkId'
import { CreateVerificationLinkArgs } from './interfaces/CreateVerificationLinkArgs'
import { UUID } from '@domain/shared/UUID'
import { StringValue } from '@domain/shared/StringValue'

export default abstract class AbstractVerificationLinkService {
  abstract getById(verificationLinkId: VerificationLinkId): Promise<VerificationLinkEntity>
  abstract getByToken(token: StringValue): Promise<VerificationLinkEntity>
  abstract getByVerificationId(verificationId: UUID): Promise<VerificationLinkEntity[]>
  abstract create(props: CreateVerificationLinkArgs): Promise<VerificationLinkEntity>
  abstract validateToken(token: StringValue): Promise<boolean>
  abstract invalidateToken(token: StringValue): Promise<boolean>
  abstract save(verificationLink: VerificationLinkEntity): Promise<VerificationLinkEntity>
} 