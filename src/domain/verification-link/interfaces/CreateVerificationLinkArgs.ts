import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'

export interface CreateVerificationLinkArgs {
  verificationId: UUID
  token?: StringValue | undefined
  expiresAt?: StringValue | undefined
} 