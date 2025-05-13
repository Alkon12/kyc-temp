import { SignedDocumentEntity } from '@domain/signedDocument/models/SignedDocumentEntity'
import { SignedDocumentId } from './models/SignedDocumentId'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'

export default interface SignedDocumentRepository {
  getById(signedDocumentId: SignedDocumentId): Promise<SignedDocumentEntity>
  getByVerificationId(verificationId: KycVerificationId): Promise<SignedDocumentEntity[]>
  getByStatus(status: string): Promise<SignedDocumentEntity[]>
  getByDocusealSubmissionId(submissionId: string): Promise<SignedDocumentEntity | null>
  create(signedDocument: SignedDocumentEntity): Promise<SignedDocumentEntity>
  save(signedDocument: SignedDocumentEntity): Promise<SignedDocumentEntity>
} 