import prisma from '@client/providers/PrismaClient'
import type SignedDocumentRepository from '@domain/signedDocument/SignedDocumentRepository'
import { SignedDocumentFactory } from '@domain/signedDocument/SignedDocumentFactory'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { SignedDocumentEntity } from '@domain/signedDocument/models/SignedDocumentEntity'
import { injectable } from 'inversify'
import { SignedDocumentId } from '@domain/signedDocument/models/SignedDocumentId'
import { NotFoundError } from '@domain/error'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'

@injectable()
export class PrismaSignedDocumentRepository implements SignedDocumentRepository {
  async getById(signedDocumentId: SignedDocumentId): Promise<SignedDocumentEntity> {
    const signedDocument = await prisma.signedDocument.findUnique({
      where: {
        id: signedDocumentId.toDTO(),
      },
      include: {
        kycVerification: true,
        template: true,
      },
    })

    if (!signedDocument) {
      throw new NotFoundError('SignedDocument not found')
    }

    return SignedDocumentFactory.fromDTO(convertPrismaToDTO<SignedDocumentEntity>(signedDocument))
  }

  async getByVerificationId(verificationId: KycVerificationId): Promise<SignedDocumentEntity[]> {
    const signedDocuments = await prisma.signedDocument.findMany({
      where: {
        verificationId: verificationId.toDTO(),
      },
      include: {
        kycVerification: true,
        template: true,
      },
    })

    return signedDocuments.map((doc) => SignedDocumentFactory.fromDTO(convertPrismaToDTO<SignedDocumentEntity>(doc)))
  }

  async getByStatus(status: string): Promise<SignedDocumentEntity[]> {
    const signedDocuments = await prisma.signedDocument.findMany({
      where: {
        status,
      },
      include: {
        kycVerification: true,
        template: true,
      },
    })

    return signedDocuments.map((doc) => SignedDocumentFactory.fromDTO(convertPrismaToDTO<SignedDocumentEntity>(doc)))
  }

  async getByDocusealSubmissionId(submissionId: string): Promise<SignedDocumentEntity | null> {
    const signedDocument = await prisma.signedDocument.findUnique({
      where: {
        docusealSubmissionId: submissionId,
      },
      include: {
        kycVerification: true,
        template: true,
      },
    })

    if (!signedDocument) {
      return null
    }

    return SignedDocumentFactory.fromDTO(convertPrismaToDTO<SignedDocumentEntity>(signedDocument))
  }

  async create(signedDocument: SignedDocumentEntity): Promise<SignedDocumentEntity> {
    const data = signedDocument.toDTO()
    
    const createdDocument = await prisma.signedDocument.create({
      data: {
        id: data.id,
        verificationId: data.verificationId,
        templateId: data.templateId,
        docusealSubmissionId: data.docusealSubmissionId,
        status: data.status,
        signerEmail: data.signerEmail,
        signerPhone: data.signerPhone,
        documentUrl: data.documentUrl,
        additionalData: data.additionalData ? JSON.parse(JSON.stringify(data.additionalData)) : undefined,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
      },
      include: {
        kycVerification: true,
        template: true,
      },
    })

    return SignedDocumentFactory.fromDTO(convertPrismaToDTO<SignedDocumentEntity>(createdDocument))
  }

  async save(signedDocument: SignedDocumentEntity): Promise<SignedDocumentEntity> {
    const data = signedDocument.toDTO()
    
    const updatedDocument = await prisma.signedDocument.update({
      where: {
        id: signedDocument.getId().toDTO(),
      },
      data: {
        docusealSubmissionId: data.docusealSubmissionId,
        status: data.status,
        signerEmail: data.signerEmail,
        signerPhone: data.signerPhone,
        documentUrl: data.documentUrl,
        additionalData: data.additionalData ? JSON.parse(JSON.stringify(data.additionalData)) : undefined,
        updatedAt: new Date(data.updatedAt),
        completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
      },
      include: {
        kycVerification: true,
        template: true,
      },
    })

    return SignedDocumentFactory.fromDTO(convertPrismaToDTO<SignedDocumentEntity>(updatedDocument))
  }
} 