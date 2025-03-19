import { StringValue } from '@domain/shared/StringValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'

export interface CreateKycPersonArgs {
  verificationId: KycVerificationId
  firstName?: StringValue
  lastName?: StringValue
  dateOfBirth?: DateTimeValue
  nationality?: StringValue
  documentNumber?: StringValue
  documentType?: StringValue
  email?: StringValue
  phone?: StringValue
  address?: StringValue
}