import { DocumentEntity } from './models/DocumentEntity'
import { DocumentId } from './models/DocumentId'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { UserId } from '@domain/user/models/UserId'

export default interface DocumentRepository {
  getById(documentId: DocumentId): Promise<DocumentEntity>
  getByVerificationId(verificationId: KycVerificationId): Promise<DocumentEntity[]>
  getByReviewer(reviewerId: UserId): Promise<DocumentEntity[]>
  getByDocumentType(documentType: string): Promise<DocumentEntity[]>
  getByVerificationStatus(status: string): Promise<DocumentEntity[]>
  create(document: DocumentEntity): Promise<DocumentEntity>
  save(document: DocumentEntity): Promise<DocumentEntity>
  delete(documentId: DocumentId): Promise<boolean>
} 