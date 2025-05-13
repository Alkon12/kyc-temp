import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import AbstractDocusealSyncService, { DocusealApiTemplate } from '@domain/docuseal/DocusealSyncService'
import { CompanyId } from '@domain/company/models/CompanyId'
import { DocusealTemplateEntity } from '@domain/docuseal/models/DocusealTemplateEntity'
import AbstractDocusealTemplateService from '@domain/docuseal/DocusealTemplateService'
import { StringValue } from '@domain/shared/StringValue'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { DocusealTemplateId } from '@domain/docuseal/models/DocusealTemplateId'

@injectable()
export class DocusealSyncService implements AbstractDocusealSyncService {
  private readonly docusealApiUrl: string
  private readonly docusealToken: string

  @inject(DI.DocusealTemplateService) private readonly _docusealTemplateService!: AbstractDocusealTemplateService

  constructor() {
    this.docusealApiUrl = process.env.DOCUSEAL_API_URL || ''
    this.docusealToken = process.env.DOCUSEAL_TOKEN || ''

    if (!this.docusealApiUrl || !this.docusealToken) {
      throw new Error('DOCUSEAL_API_URL and DOCUSEAL_TOKEN must be defined in environment variables')
    }
  }

  async getTemplatesFromDocuseal(): Promise<DocusealApiTemplate[]> {
    try {
      const url = `${this.docusealApiUrl}/api/templates`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': `${this.docusealToken}`
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data.data as DocusealApiTemplate[]
    } catch (error) {
      console.error('Error fetching Docuseal templates:', error)
      throw error
    }
  }

  async syncTemplates(companyId: CompanyId): Promise<DocusealTemplateEntity[]> {
    // Fetch templates from Docuseal API
    const apiTemplates = await this.getTemplatesFromDocuseal()
    
    // Get existing templates from our DB for the company
    const existingTemplates = await this._docusealTemplateService.getByCompanyId(companyId)
    
    // Create a map of existing templates by docusealTemplateId
    const existingTemplatesMap = new Map<string, DocusealTemplateEntity>()
    for (const template of existingTemplates) {
      existingTemplatesMap.set(template.getDocusealTemplateId()._value, template)
    }
    
    const results: DocusealTemplateEntity[] = []
    
    // Process each template from the API
    for (const apiTemplate of apiTemplates) {
      const docusealTemplateId = apiTemplate.id.toString()
      const existingTemplate = existingTemplatesMap.get(docusealTemplateId)
      
      // Determine document type based on the first document's filename or use "default"
      const documentType = apiTemplate.documents?.[0]?.filename.split('.')[0] || 'default'
      
      if (existingTemplate) {
        // Update existing template if needed
        if (existingTemplate.getName()._value !== apiTemplate.name) {
          // Update template name if it has changed
          const updatedTemplate = await this._docusealTemplateService.update(
            existingTemplate.getId(),
            existingTemplate.getIsActive()._value
          )
          results.push(updatedTemplate)
        } else {
          results.push(existingTemplate)
        }
      } else {
        // Create new template
        const newTemplate = await this._docusealTemplateService.create({
          companyId,
          name: new StringValue(apiTemplate.name),
          description: new StringValue(`Template imported from Docuseal. Fields: ${apiTemplate.fields.map(f => f.name).join(', ')}`),
          docusealTemplateId: new StringValue(docusealTemplateId),
          documentType: new StringValue(documentType),
          isActive: new BooleanValue(true)
        })
        
        results.push(newTemplate)
      }
    }
    
    return results
  }
} 