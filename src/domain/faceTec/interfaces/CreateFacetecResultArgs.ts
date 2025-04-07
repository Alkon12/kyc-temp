import { StringValue } from '@domain/shared/StringValue'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { NumberValue } from '@domain/shared/NumberValue'
import { JsonValue } from '@domain/shared/JsonValue'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { FaceTecSessionId } from '../models/FaceTecSessionId'

export interface CreateFacetecResultArgs {
  verificationId: KycVerificationId
  sessionId: FaceTecSessionId
  livenessStatus: StringValue
  enrollmentStatus: StringValue
  matchLevel?: NumberValue
  fullResponse?: JsonValue
  manualReviewRequired: BooleanValue
} 