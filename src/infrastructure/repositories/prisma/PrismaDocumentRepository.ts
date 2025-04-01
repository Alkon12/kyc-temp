import prisma from '@client/providers/PrismaClient'
import type DocumentRepository from '@domain/document/DocumentRepository'
import { DocumentFactory } from '@domain/document/DocumentFactory'
import { convertPrismaToDTO } from '@client/utils/nullToUndefined'
import { DocumentEntity } from '@domain/document/models/DocumentEntity'
import { injectable } from 'inversify'
import { DocumentId } from '@domain/document/models/DocumentId'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { UserId } from '@domain/user/models/UserId'
import { NotFoundError } from '@domain/error'

@injectable()
export class PrismaDocumentRepository implements DocumentRepository {
  async getById(documentId: DocumentId): Promise<DocumentEntity> {
    const document = await prisma.document.findUnique({
      where: {
        id: documentId.toDTO(),
      },
      include: {
        kycVerification: true,
        reviewer: true,
      },
    })

    if (!document) {
      throw new NotFoundError('Document not found')
    }

    return DocumentFactory.fromDTO(convertPrismaToDTO<DocumentEntity>(document))
  }

  async getByVerificationId(verificationId: KycVerificationId): Promise<DocumentEntity[]> {
    const documents = await prisma.document.findMany({
      where: {
        verificationId: verificationId.toDTO(),
      },
      include: {
        kycVerification: true,
        reviewer: true,
      },
    })

    return documents.map((d) => DocumentFactory.fromDTO(convertPrismaToDTO<DocumentEntity>(d)))
  }

  async getByReviewer(reviewerId: UserId): Promise<DocumentEntity[]> {
    const documents = await prisma.document.findMany({
      where: {
        reviewerId: reviewerId.toDTO(),
      },
      include: {
        kycVerification: true,
        reviewer: true,
      },
    })

    return documents.map((d) => DocumentFactory.fromDTO(convertPrismaToDTO<DocumentEntity>(d)))
  }

  async getByDocumentType(documentType: string): Promise<DocumentEntity[]> {
    const documents = await prisma.document.findMany({
      where: {
        documentType,
      },
      include: {
        kycVerification: true,
        reviewer: true,
      },
    })

    return documents.map((d) => DocumentFactory.fromDTO(convertPrismaToDTO<DocumentEntity>(d)))
  }

  async getByVerificationStatus(status: string): Promise<DocumentEntity[]> {
    const documents = await prisma.document.findMany({
      where: {
        verificationStatus: status,
      },
      include: {
        kycVerification: true,
        reviewer: true,
      },
    })

    return documents.map((d) => DocumentFactory.fromDTO(convertPrismaToDTO<DocumentEntity>(d)))
  }

  async create(document: DocumentEntity): Promise<DocumentEntity> {
    const dto = document.toDTO()
    
    // Nota: imageData es un campo que solo existe a nivel de entidad, no en la BD
    // Aquí podríamos implementar lógica para guardar la imagen en un servicio de almacenamiento
    // y luego guardar la URL en filePath, pero por ahora lo manejamos a nivel de entidad
    
    const createdDocument = await prisma.document.create({
      data: {
        id: dto.id,
        verificationId: dto.verificationId,
        documentType: dto.documentType,
        filePath: dto.filePath,
        fileName: dto.fileName,
        fileSize: dto.fileSize,
        mimeType: dto.mimeType,
        verificationStatus: dto.verificationStatus,
        ocrData: dto.ocrData,
        reviewerId: dto.reviewerId,
        reviewNotes: dto.reviewNotes,
        // No incluimos imageData aquí porque no está en el schema de Prisma
      },
      include: {
        kycVerification: true,
        reviewer: true,
      },
    })

    // Creamos la entidad que incluirá imageData (aunque se pierde al guardar en BD)
    const documentEntity = DocumentFactory.fromDTO(convertPrismaToDTO<DocumentEntity>(createdDocument))
    
    // Si había imageData en la entidad original, lo mantenemos en la nueva
    if (document.getImageData()) {
      documentEntity.props.imageData = document.getImageData()
    }
    
    return documentEntity
  }

  async save(document: DocumentEntity): Promise<DocumentEntity> {
    const dto = document.toDTO()
    const updatedDocument = await prisma.document.update({
      where: {
        id: dto.id,
      },
      data: {
        documentType: dto.documentType,
        filePath: dto.filePath,
        fileName: dto.fileName,
        fileSize: dto.fileSize,
        mimeType: dto.mimeType,
        verificationStatus: dto.verificationStatus,
        ocrData: dto.ocrData,
        reviewerId: dto.reviewerId,
        reviewNotes: dto.reviewNotes,
        updatedAt: new Date(),
        // No incluimos imageData aquí porque no está en el schema de Prisma
      },
      include: {
        kycVerification: true,
        reviewer: true,
      },
    })

    // Creamos la entidad que incluirá imageData (aunque se pierde al guardar en BD)
    const documentEntity = DocumentFactory.fromDTO(convertPrismaToDTO<DocumentEntity>(updatedDocument))
    
    // Si había imageData en la entidad original, lo mantenemos en la nueva
    if (document.getImageData()) {
      documentEntity.props.imageData = document.getImageData()
    }
    
    return documentEntity
  }

  async delete(documentId: DocumentId): Promise<boolean> {
    try {
      await prisma.document.delete({
        where: {
          id: documentId.toDTO(),
        },
      })
      return true
    } catch (error) {
      return false
    }
  }
} 