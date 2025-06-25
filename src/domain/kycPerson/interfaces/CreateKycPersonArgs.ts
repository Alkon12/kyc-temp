import { StringValue } from '@domain/shared/StringValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'

export interface CreateKycPersonArgs {
  verificationId: KycVerificationId
  firstName?: StringValue
  secondName?: StringValue
  lastName?: StringValue
  secondLastName?: StringValue
  curp?: StringValue
  dateOfBirth?: DateTimeValue
  nationality?: StringValue
  documentNumber?: StringValue
  documentType?: StringValue
  email?: StringValue
  phone?: StringValue
  street?: StringValue
  colony?: StringValue
  city?: StringValue
}