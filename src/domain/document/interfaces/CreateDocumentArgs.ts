import { StringValue } from '@domain/shared/StringValue'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { JsonValue } from '@domain/shared/JsonValue'

export interface CreateDocumentArgs {
  verificationId: KycVerificationId
  documentType: StringValue
  filePath: StringValue
  fileName: StringValue
  fileSize?: number
  mimeType?: StringValue
  ocrData?: JsonValue
} 