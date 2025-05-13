import { DocusealTemplateEntity } from '@domain/docuseal/models/DocusealTemplateEntity'
import { DocusealTemplateId } from './models/DocusealTemplateId'
import { CompanyId } from '@domain/company/models/CompanyId'

export default interface DocusealTemplateRepository {
  getById(templateId: DocusealTemplateId): Promise<DocusealTemplateEntity>
  getAll(): Promise<DocusealTemplateEntity[]>
  getByCompanyId(companyId: CompanyId): Promise<DocusealTemplateEntity[]>
  getByDocumentType(documentType: string): Promise<DocusealTemplateEntity[]>
  getActiveTemplatesByCompanyId(companyId: CompanyId): Promise<DocusealTemplateEntity[]>
  create(template: DocusealTemplateEntity): Promise<DocusealTemplateEntity>
  save(template: DocusealTemplateEntity): Promise<DocusealTemplateEntity>
} 