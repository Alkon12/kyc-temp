import prisma from '@client/providers/PrismaClient'
import type DocusealTemplateRepository from '@domain/docuseal/DocusealTemplateRepository'
import { DocusealTemplateFactory } from '@domain/docuseal/DocusealTemplateFactory'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { DocusealTemplateEntity } from '@domain/docuseal/models/DocusealTemplateEntity'
import { injectable } from 'inversify'
import { DocusealTemplateId } from '@domain/docuseal/models/DocusealTemplateId'
import { NotFoundError } from '@domain/error'
import { CompanyId } from '@domain/company/models/CompanyId'

@injectable()
export class PrismaDocusealTemplateRepository implements DocusealTemplateRepository {
  async getById(templateId: DocusealTemplateId): Promise<DocusealTemplateEntity> {
    const template = await prisma.docusealTemplate.findUnique({
      where: {
        id: templateId.toDTO(),
      },
      include: {
        company: true,
      },
    })

    if (!template) {
      throw new NotFoundError('DocusealTemplate not found')
    }

    return DocusealTemplateFactory.fromDTO(convertPrismaToDTO<DocusealTemplateEntity>(template))
  }

  async getAll(): Promise<DocusealTemplateEntity[]> {
    const templates = await prisma.docusealTemplate.findMany({
      include: {
        company: true,
      },
    })

    return templates.map((template) => DocusealTemplateFactory.fromDTO(convertPrismaToDTO<DocusealTemplateEntity>(template)))
  }

  async getByCompanyId(companyId: CompanyId): Promise<DocusealTemplateEntity[]> {
    const templates = await prisma.docusealTemplate.findMany({
      where: {
        companyId: companyId.toDTO(),
      },
      include: {
        company: true,
      },
    })

    return templates.map((template) => DocusealTemplateFactory.fromDTO(convertPrismaToDTO<DocusealTemplateEntity>(template)))
  }

  async getByDocumentType(documentType: string): Promise<DocusealTemplateEntity[]> {
    const templates = await prisma.docusealTemplate.findMany({
      where: {
        documentType,
      },
      include: {
        company: true,
      },
    })

    return templates.map((template) => DocusealTemplateFactory.fromDTO(convertPrismaToDTO<DocusealTemplateEntity>(template)))
  }

  async getActiveTemplatesByCompanyId(companyId: CompanyId): Promise<DocusealTemplateEntity[]> {
    const templates = await prisma.docusealTemplate.findMany({
      where: {
        companyId: companyId.toDTO(),
        isActive: true,
      },
      include: {
        company: true,
      },
    })

    return templates.map((template) => DocusealTemplateFactory.fromDTO(convertPrismaToDTO<DocusealTemplateEntity>(template)))
  }

  async create(template: DocusealTemplateEntity): Promise<DocusealTemplateEntity> {
    const data = template.toDTO()
    
    const createdTemplate = await prisma.docusealTemplate.create({
      data: {
        id: data.id,
        companyId: data.companyId,
        name: data.name,
        description: data.description,
        docusealTemplateId: data.docusealTemplateId,
        documentType: data.documentType,
        isActive: data.isActive,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      },
      include: {
        company: true,
      },
    })

    return DocusealTemplateFactory.fromDTO(convertPrismaToDTO<DocusealTemplateEntity>(createdTemplate))
  }

  async save(template: DocusealTemplateEntity): Promise<DocusealTemplateEntity> {
    const data = template.toDTO()
    
    const updatedTemplate = await prisma.docusealTemplate.update({
      where: {
        id: template.getId().toDTO(),
      },
      data: {
        name: data.name,
        description: data.description,
        docusealTemplateId: data.docusealTemplateId,
        documentType: data.documentType,
        isActive: data.isActive,
        updatedAt: new Date(data.updatedAt),
      },
      include: {
        company: true,
      },
    })

    return DocusealTemplateFactory.fromDTO(convertPrismaToDTO<DocusealTemplateEntity>(updatedTemplate))
  }
} 