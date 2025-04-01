import { UUID } from '@domain/shared/UUID'
import { DTO } from '@domain/kernel/DTO'
import { DocumentEntity, DocumentEntityProps } from './models/DocumentEntity'
import { StringValue } from '@domain/shared/StringValue'
import { DocumentId } from './models/DocumentId'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { NumberValue } from '@domain/shared/NumberValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { JsonValue } from '@domain/shared/JsonValue'
import { UserId } from '@domain/user/models/UserId'
import { KycVerificationFactory } from '@domain/kycVerification/KycVerificationFactory'
import { UserFactory } from '@domain/user/UserFactory'

export type DocumentArgs = {
  id?: string
  verificationId: KycVerificationId
  documentType: StringValue
  filePath: StringValue
  fileName: StringValue
  fileSize?: number
  mimeType?: StringValue
  verificationStatus?: StringValue
  ocrData?: JsonValue
  reviewerId?: string
  reviewNotes?: StringValue
  createdAt?: Date
  updatedAt?: Date
  imageData?: StringValue
}

export class DocumentFactory {
  static fromDTO(dto: DTO<DocumentEntity>): DocumentEntity {
    return new DocumentEntity({
      id: new DocumentId(dto.id),
      verificationId: new KycVerificationId(dto.verificationId),
      documentType: new StringValue(dto.documentType),
      filePath: new StringValue(dto.filePath),
      fileName: new StringValue(dto.fileName),
      fileSize: dto.fileSize ? new NumberValue(dto.fileSize) : undefined,
      mimeType: dto.mimeType ? new StringValue(dto.mimeType) : undefined,
      verificationStatus: new StringValue(dto.verificationStatus),
      ocrData: dto.ocrData ? new JsonValue(dto.ocrData) : undefined,
      reviewerId: dto.reviewerId ? new UserId(dto.reviewerId) : undefined,
      reviewNotes: dto.reviewNotes ? new StringValue(dto.reviewNotes) : undefined,
      createdAt: new DateTimeValue(dto.createdAt),
      updatedAt: new DateTimeValue(dto.updatedAt),
      
      kycVerification: dto.kycVerification ? KycVerificationFactory.fromDTO(dto.kycVerification) : undefined,
      reviewer: dto.reviewer ? UserFactory.fromDTO(dto.reviewer) : undefined,
    })
  }

  static create(args: DocumentArgs): DocumentEntity {
    return new DocumentEntity({
      id: args.id ? new DocumentId(args.id) : new DocumentId(),
      verificationId: args.verificationId,
      documentType: args.documentType,
      filePath: args.filePath,
      fileName: args.fileName,
      fileSize: args.fileSize !== undefined ? new NumberValue(args.fileSize) : undefined,
      mimeType: args.mimeType,
      verificationStatus: args.verificationStatus || new StringValue('pending'),
      ocrData: args.ocrData,
      reviewerId: args.reviewerId ? new UserId(args.reviewerId) : undefined,
      reviewNotes: args.reviewNotes,
      createdAt: args.createdAt ? new DateTimeValue(args.createdAt) : new DateTimeValue(new Date()),
      updatedAt: args.updatedAt ? new DateTimeValue(args.updatedAt) : new DateTimeValue(new Date()),
    })
  }
} 