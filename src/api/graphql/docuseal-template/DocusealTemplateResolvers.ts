import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import { DocusealTemplateId } from '@domain/docuseal/models/DocusealTemplateId'
import { DocusealTemplateEntity } from '@domain/docuseal/models/DocusealTemplateEntity'
import { CompanyId } from '@domain/company/models/CompanyId'
import { StringValue } from '@domain/shared/StringValue'
import { BooleanValue } from '@domain/shared/BooleanValue'
import AbstractDocusealTemplateService from '@domain/docuseal/DocusealTemplateService'
import AbstractDocusealSyncService from '@domain/docuseal/DocusealSyncService'
import { CreateDocusealTemplateArgs } from '@domain/docuseal/interfaces/CreateDocusealTemplateArgs'
import {
  QueryGetDocusealTemplateByIdArgs,
  QueryGetDocusealTemplatesByCompanyIdArgs,
  QueryGetActiveDocusealTemplatesByCompanyIdArgs,
  QueryGetDocusealTemplatesByDocumentTypeArgs,
  MutationCreateDocusealTemplateArgs,
  MutationUpdateDocusealTemplateStatusArgs,
  MutationSyncDocusealTemplatesArgs
} from '../app.schema.gen'

@injectable()
export class DocusealTemplateResolvers {
  build() {
    return {
      Query: {
        getDocusealTemplateById: this.getDocusealTemplateById,
        getAllDocusealTemplates: this.getAllDocusealTemplates,
        getDocusealTemplatesByCompanyId: this.getDocusealTemplatesByCompanyId,
        getActiveDocusealTemplatesByCompanyId: this.getActiveDocusealTemplatesByCompanyId,
        getDocusealTemplatesByDocumentType: this.getDocusealTemplatesByDocumentType,
      },
      Mutation: {
        createDocusealTemplate: this.createDocusealTemplate,
        updateDocusealTemplateStatus: this.updateDocusealTemplateStatus,
        syncDocusealTemplates: this.syncDocusealTemplates,
      },
    }
  }

  getDocusealTemplateById = async (_parent: unknown, { templateId }: QueryGetDocusealTemplateByIdArgs): Promise<DTO<DocusealTemplateEntity>> => {
    const docusealTemplateService = container.get<AbstractDocusealTemplateService>(DI.DocusealTemplateService)
    
    const template = await docusealTemplateService.getById(new DocusealTemplateId(templateId))
    
    return template.toDTO()
  }

  getAllDocusealTemplates = async (): Promise<DTO<DocusealTemplateEntity>[]> => {
    const docusealTemplateService = container.get<AbstractDocusealTemplateService>(DI.DocusealTemplateService)
    
    const templates = await docusealTemplateService.getAll()
    
    return templates.map(template => template.toDTO())
  }

  getDocusealTemplatesByCompanyId = async (_parent: unknown, { companyId }: QueryGetDocusealTemplatesByCompanyIdArgs): Promise<DTO<DocusealTemplateEntity>[]> => {
    const docusealTemplateService = container.get<AbstractDocusealTemplateService>(DI.DocusealTemplateService)
    
    const templates = await docusealTemplateService.getByCompanyId(new CompanyId(companyId))
    
    return templates.map(template => template.toDTO())
  }

  getActiveDocusealTemplatesByCompanyId = async (_parent: unknown, { companyId }: QueryGetActiveDocusealTemplatesByCompanyIdArgs): Promise<DTO<DocusealTemplateEntity>[]> => {
    const docusealTemplateService = container.get<AbstractDocusealTemplateService>(DI.DocusealTemplateService)
    
    const templates = await docusealTemplateService.getActiveTemplatesByCompanyId(new CompanyId(companyId))
    
    return templates.map(template => template.toDTO())
  }

  getDocusealTemplatesByDocumentType = async (_parent: unknown, { documentType }: QueryGetDocusealTemplatesByDocumentTypeArgs): Promise<DTO<DocusealTemplateEntity>[]> => {
    const docusealTemplateService = container.get<AbstractDocusealTemplateService>(DI.DocusealTemplateService)
    
    const templates = await docusealTemplateService.getByDocumentType(documentType)
    
    return templates.map(template => template.toDTO())
  }

  createDocusealTemplate = async (_parent: unknown, args: MutationCreateDocusealTemplateArgs): Promise<DTO<DocusealTemplateEntity>> => {
    const docusealTemplateService = container.get<AbstractDocusealTemplateService>(DI.DocusealTemplateService)
    
    const createArgs: CreateDocusealTemplateArgs = {
      companyId: new CompanyId(args.companyId),
      name: new StringValue(args.name),
      description: args.description ? new StringValue(args.description) : undefined,
      docusealTemplateId: new StringValue(args.docusealTemplateId),
      documentType: new StringValue(args.documentType),
      isActive: args.isActive !== undefined ? new BooleanValue(args.isActive) : undefined,
    }
    
    const template = await docusealTemplateService.create(createArgs)
    
    return template.toDTO()
  }

  updateDocusealTemplateStatus = async (_parent: unknown, { templateId, isActive }: MutationUpdateDocusealTemplateStatusArgs): Promise<DTO<DocusealTemplateEntity>> => {
    const docusealTemplateService = container.get<AbstractDocusealTemplateService>(DI.DocusealTemplateService)
    
    const template = await docusealTemplateService.update(new DocusealTemplateId(templateId), isActive)
    
    return template.toDTO()
  }
  
  syncDocusealTemplates = async (_parent: unknown, { companyId }: MutationSyncDocusealTemplatesArgs): Promise<DTO<DocusealTemplateEntity>[]> => {
    const docusealSyncService = container.get<AbstractDocusealSyncService>(DI.DocusealSyncService)
    
    const templates = await docusealSyncService.syncTemplates(new CompanyId(companyId))
    
    return templates.map(template => template.toDTO())
  }
} 