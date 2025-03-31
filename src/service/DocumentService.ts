import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { DocumentEntity } from '@domain/document/models/DocumentEntity'
import type DocumentRepository from '@domain/document/DocumentRepository'
import AbstractDocumentService from '@domain/document/DocumentService'
import { DocumentId } from '@domain/document/models/DocumentId'
import { CreateDocumentArgs } from '@domain/document/interfaces/CreateDocumentArgs'
import { DocumentFactory } from '@domain/document/DocumentFactory'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { UserId } from '@domain/user/models/UserId'
import { NotFoundError } from '@domain/error'
import { NumberValue } from '@domain/shared/NumberValue'
import { StringValue } from '@domain/shared/StringValue'
import { DateTimeValue } from '@domain/shared/DateTime'

@injectable()
export class DocumentService implements AbstractDocumentService {
  @inject(DI.DocumentRepository) private readonly _documentRepository!: DocumentRepository

  async getById(documentId: DocumentId): Promise<DocumentEntity> {
    return this._documentRepository.getById(documentId)
  }

  async getByVerificationId(verificationId: KycVerificationId): Promise<DocumentEntity[]> {
    return this._documentRepository.getByVerificationId(verificationId)
  }

  async getByReviewer(reviewerId: UserId): Promise<DocumentEntity[]> {
    return this._documentRepository.getByReviewer(reviewerId)
  }

  async getByDocumentType(documentType: string): Promise<DocumentEntity[]> {
    return this._documentRepository.getByDocumentType(documentType)
  }

  async getByVerificationStatus(status: string): Promise<DocumentEntity[]> {
    return this._documentRepository.getByVerificationStatus(status)
  }

  async create(props: CreateDocumentArgs): Promise<DocumentEntity> {
    const document = DocumentFactory.create({
      verificationId: props.verificationId,
      documentType: props.documentType,
      filePath: props.filePath,
      fileName: props.fileName,
      fileSize: props.fileSize,
      mimeType: props.mimeType,
      ocrData: props.ocrData,
      verificationStatus: new StringValue('pending')
      // createdAt and updatedAt are provided by the factory with default values
    })

    return this._documentRepository.create(document)
  }

  async updateVerificationStatus(documentId: DocumentId, status: string): Promise<DocumentEntity> {
    const document = await this._documentRepository.getById(documentId)
    if (!document) {
      throw new NotFoundError('Document not found')
    }

    document.updateVerificationStatus(status)
    return this._documentRepository.save(document)
  }

  async assignReviewer(documentId: DocumentId, reviewerId: UserId, notes?: string): Promise<DocumentEntity> {
    const document = await this._documentRepository.getById(documentId)
    if (!document) {
      throw new NotFoundError('Document not found')
    }

    document.setReviewer(reviewerId, notes)
    return this._documentRepository.save(document)
  }

  async updateOcrData(documentId: DocumentId, ocrData: any): Promise<DocumentEntity> {
    const document = await this._documentRepository.getById(documentId)
    if (!document) {
      throw new NotFoundError('Document not found')
    }

    document.updateOcrData(ocrData)
    return this._documentRepository.save(document)
  }

  async delete(documentId: DocumentId): Promise<boolean> {
    return this._documentRepository.delete(documentId)
  }
} 