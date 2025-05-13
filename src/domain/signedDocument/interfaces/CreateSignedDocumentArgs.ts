import { StringValue } from '@domain/shared/StringValue'
import { JsonValue } from '@domain/shared/JsonValue'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { DocusealTemplateId } from '@domain/docuseal/models/DocusealTemplateId'

export interface CreateSignedDocumentArgs {
  verificationId: KycVerificationId
  templateId: DocusealTemplateId
  docusealSubmissionId?: StringValue
  status?: StringValue
  signerEmail?: StringValue
  signerPhone?: StringValue
  documentUrl?: StringValue
  additionalData?: JsonValue
} 