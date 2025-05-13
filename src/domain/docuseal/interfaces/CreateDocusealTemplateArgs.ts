import { StringValue } from '@domain/shared/StringValue'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { CompanyId } from '@domain/company/models/CompanyId'
import { JsonValue } from '@domain/shared/JsonValue'

export interface CreateDocusealTemplateArgs {
  companyId: CompanyId
  name: StringValue
  description?: StringValue
  docusealTemplateId: StringValue
  documentType: StringValue
  isActive?: BooleanValue
  documents?: JsonValue
  externalId?: StringValue
  fields?: JsonValue
  folderName?: StringValue
  schema?: JsonValue
  submitters?: JsonValue
} 