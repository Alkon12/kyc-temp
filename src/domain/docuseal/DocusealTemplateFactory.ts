import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { DocusealTemplateEntity, DocusealTemplateEntityProps } from './models/DocusealTemplateEntity'
import { StringValue } from '@domain/shared/StringValue'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { DocusealTemplateId } from './models/DocusealTemplateId'
import { CompanyId } from '@domain/company/models/CompanyId'
import { CompanyFactory } from '@domain/company/CompanyFactory'
import { SignedDocumentFactory } from '@domain/signedDocument/SignedDocumentFactory'

export type DocusealTemplateArgs = Merge<
  Omit<DocusealTemplateEntityProps, 'company' | 'signedDocuments'>,
  {
    id?: UUID
    createdAt?: Date
    updatedAt?: Date
  }
>

export class DocusealTemplateFactory {
  static fromDTO(dto: DTO<DocusealTemplateEntity>): DocusealTemplateEntity {
    return new DocusealTemplateEntity({
      id: new DocusealTemplateId(dto.id),
      companyId: new CompanyId(dto.companyId),
      name: new StringValue(dto.name),
      description: dto.description ? new StringValue(dto.description) : undefined,
      docusealTemplateId: new StringValue(dto.docusealTemplateId),
      documentType: new StringValue(dto.documentType),
      isActive: new BooleanValue(dto.isActive),
      createdAt: new DateTimeValue(dto.createdAt),
      updatedAt: new DateTimeValue(dto.updatedAt),

      company: dto.company ? CompanyFactory.fromDTO(dto.company) : undefined,
      signedDocuments: dto.signedDocuments
        ? dto.signedDocuments.map((signedDocument) => SignedDocumentFactory.fromDTO(signedDocument))
        : undefined,
    })
  }

  static create(args: DocusealTemplateArgs): DocusealTemplateEntity {
    return new DocusealTemplateEntity({
      ...args,
      id: args.id ? new DocusealTemplateId(args.id) : new DocusealTemplateId(),
      createdAt: args.createdAt ? new DateTimeValue(args.createdAt) : new DateTimeValue(new Date()),
      updatedAt: args.updatedAt ? new DateTimeValue(args.updatedAt) : new DateTimeValue(new Date()),
    })
  }
} 