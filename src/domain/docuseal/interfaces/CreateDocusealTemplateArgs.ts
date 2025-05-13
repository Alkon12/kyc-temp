import { StringValue } from '@domain/shared/StringValue'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { CompanyId } from '@domain/company/models/CompanyId'

export interface CreateDocusealTemplateArgs {
  companyId: CompanyId
  name: StringValue
  description?: StringValue
  docusealTemplateId: StringValue
  documentType: StringValue
  isActive?: BooleanValue
} 