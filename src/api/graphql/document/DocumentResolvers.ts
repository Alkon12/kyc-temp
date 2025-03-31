import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import { DocumentId } from '@domain/document/models/DocumentId'
import { 
  QueryGetDocumentByIdArgs,
  QueryGetDocumentsByVerificationIdArgs,
  QueryGetDocumentsByReviewerArgs,
  QueryGetDocumentsByTypeArgs,
  QueryGetDocumentsByStatusArgs,
  MutationUpdateDocumentStatusArgs,
  MutationAssignDocumentReviewerArgs,
  MutationUpdateDocumentOcrDataArgs,
  MutationDeleteDocumentArgs
} from '../app.schema.gen'
import AbstractDocumentService from '@domain/document/DocumentService'
import { DocumentEntity } from '@domain/document/models/DocumentEntity'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { UserId } from '@domain/user/models/UserId'

@injectable()
export class DocumentResolvers {
  build() {
    return {
      Query: {
        getDocumentById: this.getDocumentById,
        getDocumentsByVerificationId: this.getDocumentsByVerificationId,
        getDocumentsByReviewer: this.getDocumentsByReviewer,
        getDocumentsByType: this.getDocumentsByType,
        getDocumentsByStatus: this.getDocumentsByStatus,
      },
      Mutation: {
        updateDocumentStatus: this.updateDocumentStatus,
        assignDocumentReviewer: this.assignDocumentReviewer,
        updateDocumentOcrData: this.updateDocumentOcrData,
        deleteDocument: this.deleteDocument,
      },
    }
  }

  getDocumentById = async (_parent: unknown, { documentId }: QueryGetDocumentByIdArgs): Promise<DTO<DocumentEntity>> => {
    const documentService = container.get<AbstractDocumentService>(DI.DocumentService)
    const document = await documentService.getById(new DocumentId(documentId))
    return document.toDTO()
  }

  getDocumentsByVerificationId = async (_parent: unknown, { verificationId }: QueryGetDocumentsByVerificationIdArgs): Promise<DTO<DocumentEntity>[]> => {
    const documentService = container.get<AbstractDocumentService>(DI.DocumentService)
    const documents = await documentService.getByVerificationId(new KycVerificationId(verificationId))
    return documents.map(doc => doc.toDTO())
  }

  getDocumentsByReviewer = async (_parent: unknown, { reviewerId }: QueryGetDocumentsByReviewerArgs): Promise<DTO<DocumentEntity>[]> => {
    const documentService = container.get<AbstractDocumentService>(DI.DocumentService)
    const documents = await documentService.getByReviewer(new UserId(reviewerId))
    return documents.map(doc => doc.toDTO())
  }

  getDocumentsByType = async (_parent: unknown, { documentType }: QueryGetDocumentsByTypeArgs): Promise<DTO<DocumentEntity>[]> => {
    const documentService = container.get<AbstractDocumentService>(DI.DocumentService)
    const documents = await documentService.getByDocumentType(documentType)
    return documents.map(doc => doc.toDTO())
  }

  getDocumentsByStatus = async (_parent: unknown, { status }: QueryGetDocumentsByStatusArgs): Promise<DTO<DocumentEntity>[]> => {
    const documentService = container.get<AbstractDocumentService>(DI.DocumentService)
    const documents = await documentService.getByVerificationStatus(status)
    return documents.map(doc => doc.toDTO())
  }

  updateDocumentStatus = async (_parent: unknown, { documentId, status }: MutationUpdateDocumentStatusArgs): Promise<DTO<DocumentEntity>> => {
    const documentService = container.get<AbstractDocumentService>(DI.DocumentService)
    const updatedDocument = await documentService.updateVerificationStatus(new DocumentId(documentId), status)
    return updatedDocument.toDTO()
  }

  assignDocumentReviewer = async (_parent: unknown, { documentId, reviewerId, notes }: MutationAssignDocumentReviewerArgs): Promise<DTO<DocumentEntity>> => {
    const documentService = container.get<AbstractDocumentService>(DI.DocumentService)
    const updatedDocument = await documentService.assignReviewer(new DocumentId(documentId), new UserId(reviewerId), notes || undefined)
    return updatedDocument.toDTO()
  }

  updateDocumentOcrData = async (_parent: unknown, { documentId, ocrData }: MutationUpdateDocumentOcrDataArgs): Promise<DTO<DocumentEntity>> => {
    const documentService = container.get<AbstractDocumentService>(DI.DocumentService)
    const updatedDocument = await documentService.updateOcrData(new DocumentId(documentId), ocrData)
    return updatedDocument.toDTO()
  }

  deleteDocument = async (_parent: unknown, { documentId }: MutationDeleteDocumentArgs): Promise<boolean> => {
    const documentService = container.get<AbstractDocumentService>(DI.DocumentService)
    return documentService.delete(new DocumentId(documentId))
  }
} 