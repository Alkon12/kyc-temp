import { CompanyId } from '@domain/company/models/CompanyId'
import { DocusealTemplateEntity } from './models/DocusealTemplateEntity'

export interface DocusealApiTemplate {
  id: number
  name: string
  documents: Array<{
    id: number
    filename: string
  }>
  schema: Array<{
    name: string
  }>
  fields: Array<{
    name: string
    type: string
    required: boolean
  }>
  created_at: string
  updated_at: string
}

export default abstract class AbstractDocusealSyncService {
  abstract syncTemplates(companyId: CompanyId): Promise<DocusealTemplateEntity[]>
  abstract getTemplatesFromDocuseal(): Promise<DocusealApiTemplate[]>
} 