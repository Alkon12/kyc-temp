import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { SignedDocumentEntity } from '@domain/signedDocument/models/SignedDocumentEntity'
import type SignedDocumentRepository from '@domain/signedDocument/SignedDocumentRepository'
import AbstractSignedDocumentService from '@domain/signedDocument/SignedDocumentService'
import { SignedDocumentId } from '@domain/signedDocument/models/SignedDocumentId'
import { CreateSignedDocumentArgs } from '@domain/signedDocument/interfaces/CreateSignedDocumentArgs'
import { SignedDocumentFactory } from '@domain/signedDocument/SignedDocumentFactory'
import { StringValue } from '@domain/shared/StringValue'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'

@injectable()
export class SignedDocumentService implements AbstractSignedDocumentService {
  @inject(DI.SignedDocumentRepository) private readonly _signedDocumentRepository!: SignedDocumentRepository

  async getById(signedDocumentId: SignedDocumentId): Promise<SignedDocumentEntity> {
    return this._signedDocumentRepository.getById(signedDocumentId)
  }

  async getByVerificationId(verificationId: KycVerificationId): Promise<SignedDocumentEntity[]> {
    return this._signedDocumentRepository.getByVerificationId(verificationId)
  }

  async getByStatus(status: string): Promise<SignedDocumentEntity[]> {
    return this._signedDocumentRepository.getByStatus(status)
  }

  async getByDocusealSubmissionId(submissionId: string): Promise<SignedDocumentEntity | null> {
    return this._signedDocumentRepository.getByDocusealSubmissionId(submissionId)
  }

  async create(props: CreateSignedDocumentArgs): Promise<SignedDocumentEntity> {
    const signedDocument = SignedDocumentFactory.create({
      verificationId: props.verificationId,
      templateId: props.templateId,
      docusealSubmissionId: props.docusealSubmissionId,
      status: props.status || new StringValue('pending'),
      signerEmail: props.signerEmail,
      signerPhone: props.signerPhone,
      documentUrl: props.documentUrl,
      additionalData: props.additionalData,
    })

    return this._signedDocumentRepository.create(signedDocument)
  }

  async updateStatus(signedDocumentId: SignedDocumentId, status: string): Promise<SignedDocumentEntity> {
    const signedDocument = await this._signedDocumentRepository.getById(signedDocumentId)
    signedDocument.setStatus(new StringValue(status))

    return this._signedDocumentRepository.save(signedDocument)
  }

  async updateDocusealSubmissionId(signedDocumentId: SignedDocumentId, submissionId: string): Promise<SignedDocumentEntity> {
    const signedDocument = await this._signedDocumentRepository.getById(signedDocumentId)
    signedDocument.setDocusealSubmissionId(new StringValue(submissionId))

    return this._signedDocumentRepository.save(signedDocument)
  }

  async updateDocumentUrl(signedDocumentId: SignedDocumentId, url: string): Promise<SignedDocumentEntity> {
    const signedDocument = await this._signedDocumentRepository.getById(signedDocumentId)
    signedDocument.setDocumentUrl(new StringValue(url))

    return this._signedDocumentRepository.save(signedDocument)
  }
} 