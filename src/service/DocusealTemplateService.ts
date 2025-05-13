import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { DocusealTemplateEntity } from '@domain/docuseal/models/DocusealTemplateEntity'
import type DocusealTemplateRepository from '@domain/docuseal/DocusealTemplateRepository'
import AbstractDocusealTemplateService from '@domain/docuseal/DocusealTemplateService'
import { DocusealTemplateId } from '@domain/docuseal/models/DocusealTemplateId'
import { CreateDocusealTemplateArgs } from '@domain/docuseal/interfaces/CreateDocusealTemplateArgs'
import { DocusealTemplateFactory } from '@domain/docuseal/DocusealTemplateFactory'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { CompanyId } from '@domain/company/models/CompanyId'

@injectable()
export class DocusealTemplateService implements AbstractDocusealTemplateService {
  @inject(DI.DocusealTemplateRepository) private readonly _docusealTemplateRepository!: DocusealTemplateRepository

  async getById(templateId: DocusealTemplateId): Promise<DocusealTemplateEntity> {
    return this._docusealTemplateRepository.getById(templateId)
  }

  async getAll(): Promise<DocusealTemplateEntity[]> {
    return this._docusealTemplateRepository.getAll()
  }

  async getByCompanyId(companyId: CompanyId): Promise<DocusealTemplateEntity[]> {
    return this._docusealTemplateRepository.getByCompanyId(companyId)
  }

  async getActiveTemplatesByCompanyId(companyId: CompanyId): Promise<DocusealTemplateEntity[]> {
    return this._docusealTemplateRepository.getActiveTemplatesByCompanyId(companyId)
  }

  async getByDocumentType(documentType: string): Promise<DocusealTemplateEntity[]> {
    return this._docusealTemplateRepository.getByDocumentType(documentType)
  }

  async create(props: CreateDocusealTemplateArgs): Promise<DocusealTemplateEntity> {
    const template = DocusealTemplateFactory.create({
      companyId: props.companyId,
      name: props.name,
      description: props.description,
      docusealTemplateId: props.docusealTemplateId,
      documentType: props.documentType,
      isActive: props.isActive || new BooleanValue(true),
    })

    return this._docusealTemplateRepository.create(template)
  }

  async update(templateId: DocusealTemplateId, isActive: boolean): Promise<DocusealTemplateEntity> {
    const template = await this._docusealTemplateRepository.getById(templateId)
    template.setIsActive(new BooleanValue(isActive))

    return this._docusealTemplateRepository.save(template)
  }
} 