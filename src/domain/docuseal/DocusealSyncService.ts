import { CompanyId } from '@domain/company/models/CompanyId'
import { DocusealTemplateEntity } from './models/DocusealTemplateEntity'

export interface DocusealApiTemplate {
  id: number
  name: string
  documents: Array<{
    id: number
    filename: string
    url: string
    uuid: string
  }>
  schema: Array<{
    name: string
    attachment_uuid: string
  }>
  fields: Array<{
    name: string
    type: string
    required: boolean
    uuid: string
    submitter_uuid: string
    areas: Array<{
      x: number
      y: number
      w: number
      h: number
      page: number
      attachment_uuid: string
    }>
  }>
  submitters: Array<{
    name: string
    uuid: string
  }>
  created_at: string
  updated_at: string
  external_id: string | null
  folder_name: string | null
}

export default abstract class AbstractDocusealSyncService {
  abstract syncTemplates(companyId: CompanyId): Promise<DocusealTemplateEntity[]>
  abstract getTemplatesFromDocuseal(): Promise<DocusealApiTemplate[]>
} 