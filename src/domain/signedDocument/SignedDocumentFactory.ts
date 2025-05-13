import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { SignedDocumentEntity, SignedDocumentEntityProps } from './models/SignedDocumentEntity'
import { StringValue } from '@domain/shared/StringValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { JsonValue } from '@domain/shared/JsonValue'
import { SignedDocumentId } from './models/SignedDocumentId'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { DocusealTemplateId } from '@domain/docuseal/models/DocusealTemplateId'
import { KycVerificationFactory } from '@domain/kycVerification/KycVerificationFactory'
import { DocusealTemplateFactory } from '@domain/docuseal/DocusealTemplateFactory'

export type SignedDocumentArgs = Merge<
  Omit<SignedDocumentEntityProps, 'kycVerification' | 'template'>,
  {
    id?: UUID
    createdAt?: Date
    updatedAt?: Date
    completedAt?: Date
    additionalData?: Record<string, any>
  }
>

export class SignedDocumentFactory {
  static fromDTO(dto: DTO<SignedDocumentEntity>): SignedDocumentEntity {
    return new SignedDocumentEntity({
      id: new SignedDocumentId(dto.id),
      verificationId: new KycVerificationId(dto.verificationId),
      templateId: new DocusealTemplateId(dto.templateId),
      docusealSubmissionId: dto.docusealSubmissionId ? new StringValue(dto.docusealSubmissionId) : undefined,
      status: new StringValue(dto.status),
      signerEmail: dto.signerEmail ? new StringValue(dto.signerEmail) : undefined,
      signerPhone: dto.signerPhone ? new StringValue(dto.signerPhone) : undefined,
      documentUrl: dto.documentUrl ? new StringValue(dto.documentUrl) : undefined,
      additionalData: dto.additionalData ? new JsonValue(dto.additionalData) : undefined,
      createdAt: new DateTimeValue(dto.createdAt),
      updatedAt: new DateTimeValue(dto.updatedAt),
      completedAt: dto.completedAt ? new DateTimeValue(dto.completedAt) : undefined,

      kycVerification: dto.kycVerification ? KycVerificationFactory.fromDTO(dto.kycVerification) : undefined,
      template: dto.template ? DocusealTemplateFactory.fromDTO(dto.template) : undefined,
    })
  }

  static create(args: SignedDocumentArgs): SignedDocumentEntity {
    return new SignedDocumentEntity({
      ...args,
      id: args.id ? new SignedDocumentId(args.id) : new SignedDocumentId(),
      additionalData: args.additionalData ? new JsonValue(args.additionalData) : undefined,
      createdAt: args.createdAt ? new DateTimeValue(args.createdAt) : new DateTimeValue(new Date()),
      updatedAt: args.updatedAt ? new DateTimeValue(args.updatedAt) : new DateTimeValue(new Date()),
      completedAt: args.completedAt ? new DateTimeValue(args.completedAt) : undefined,
    })
  }
} 