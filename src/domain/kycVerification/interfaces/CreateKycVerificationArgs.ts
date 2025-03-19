import { StringValue } from '@domain/shared/StringValue'
import { CompanyId } from '@domain/company/models/CompanyId'
import { KycVerificationType } from '../models/KycVerificationType'

export interface CreateKycVerificationArgs {
  externalReferenceId?: StringValue
  companyId: CompanyId
  verificationType: KycVerificationType
  riskLevel?: StringValue
  notes?: StringValue
}