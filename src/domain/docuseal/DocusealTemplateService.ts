import { DocusealTemplateEntity } from '@domain/docuseal/models/DocusealTemplateEntity'
import { DocusealTemplateId } from './models/DocusealTemplateId'
import { CreateDocusealTemplateArgs } from './interfaces/CreateDocusealTemplateArgs'
import { CompanyId } from '@domain/company/models/CompanyId'

export default abstract class AbstractDocusealTemplateService {
  abstract getById(templateId: DocusealTemplateId): Promise<DocusealTemplateEntity>
  abstract getAll(): Promise<DocusealTemplateEntity[]>
  abstract getByCompanyId(companyId: CompanyId): Promise<DocusealTemplateEntity[]>
  abstract getActiveTemplatesByCompanyId(companyId: CompanyId): Promise<DocusealTemplateEntity[]>
  abstract getByDocumentType(documentType: string): Promise<DocusealTemplateEntity[]>
  abstract create(props: CreateDocusealTemplateArgs): Promise<DocusealTemplateEntity>
  abstract update(templateId: DocusealTemplateId, isActive: boolean): Promise<DocusealTemplateEntity>
} 