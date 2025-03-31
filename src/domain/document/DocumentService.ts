import { DocumentEntity } from './models/DocumentEntity'
import { DocumentId } from './models/DocumentId'
import { CreateDocumentArgs } from './interfaces/CreateDocumentArgs'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { UserId } from '@domain/user/models/UserId'

export default abstract class AbstractDocumentService {
  abstract getById(documentId: DocumentId): Promise<DocumentEntity>
  abstract getByVerificationId(verificationId: KycVerificationId): Promise<DocumentEntity[]>
  abstract getByReviewer(reviewerId: UserId): Promise<DocumentEntity[]>
  abstract getByDocumentType(documentType: string): Promise<DocumentEntity[]>
  abstract getByVerificationStatus(status: string): Promise<DocumentEntity[]>
  abstract create(props: CreateDocumentArgs): Promise<DocumentEntity>
  abstract updateVerificationStatus(documentId: DocumentId, status: string): Promise<DocumentEntity>
  abstract assignReviewer(documentId: DocumentId, reviewerId: UserId, notes?: string): Promise<DocumentEntity>
  abstract updateOcrData(documentId: DocumentId, ocrData: any): Promise<DocumentEntity>
  abstract delete(documentId: DocumentId): Promise<boolean>
} 