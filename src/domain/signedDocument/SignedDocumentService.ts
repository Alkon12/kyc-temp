import { SignedDocumentEntity } from '@domain/signedDocument/models/SignedDocumentEntity'
import { SignedDocumentId } from './models/SignedDocumentId'
import { CreateSignedDocumentArgs } from './interfaces/CreateSignedDocumentArgs'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'

export default abstract class AbstractSignedDocumentService {
  abstract getById(signedDocumentId: SignedDocumentId): Promise<SignedDocumentEntity>
  abstract getByVerificationId(verificationId: KycVerificationId): Promise<SignedDocumentEntity[]>
  abstract getByStatus(status: string): Promise<SignedDocumentEntity[]>
  abstract getByDocusealSubmissionId(submissionId: string): Promise<SignedDocumentEntity | null>
  abstract create(props: CreateSignedDocumentArgs): Promise<SignedDocumentEntity>
  abstract updateStatus(signedDocumentId: SignedDocumentId, status: string): Promise<SignedDocumentEntity>
  abstract updateDocusealSubmissionId(signedDocumentId: SignedDocumentId, submissionId: string): Promise<SignedDocumentEntity>
  abstract updateDocumentUrl(signedDocumentId: SignedDocumentId, url: string): Promise<SignedDocumentEntity>
} 