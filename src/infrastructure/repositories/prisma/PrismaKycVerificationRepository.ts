import prisma from '@client/providers/PrismaClient'
import type KycVerificationRepository from '@domain/kycVerification/KycVerificationRepository'
import { KycVerificationFactory } from '@domain/kycVerification/KycVerificationFactory'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { KycVerificationEntity } from '@domain/kycVerification/models/KycVerificationEntity'
import { injectable } from 'inversify'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { CompanyId } from '@domain/company/models/CompanyId'
import { UserId } from '@domain/user/models/UserId'
import { KycVerificationStatus } from '@domain/kycVerification/models/KycVerificationStatus'
import { NotFoundError } from '@domain/error'

@injectable()
export class PrismaKycVerificationRepository implements KycVerificationRepository {
  async getById(id: KycVerificationId): Promise<KycVerificationEntity> {
    const verification = await prisma.kycVerification.findUnique({
      where: {
        id: id.toDTO(),
      },
      include: {
        company: true,
        assignedUser: true,
        kycPersons: true,
      },
    })

    if (!verification) {
      throw new NotFoundError('KYC Verification not found')
    }

    return KycVerificationFactory.fromDTO(convertPrismaToDTO<KycVerificationEntity>(verification))
  }

  async getByExternalReferenceId(externalReferenceId: string, companyId: CompanyId): Promise<KycVerificationEntity | null> {
    const verification = await prisma.kycVerification.findFirst({
      where: {
        externalReferenceId,
        companyId: companyId.toDTO(),
      },
      include: {
        company: true,
        assignedUser: true,
      },
    })

    if (!verification) {
      return null
    }

    return KycVerificationFactory.fromDTO(convertPrismaToDTO<KycVerificationEntity>(verification))
  }

  async getByCompanyId(companyId: CompanyId): Promise<KycVerificationEntity[]> {
    const verifications = await prisma.kycVerification.findMany({
      where: {
        companyId: companyId.toDTO(),
      },
      include: {
        company: true,
        assignedUser: true,
      },
    })

    return verifications.map((v) => KycVerificationFactory.fromDTO(convertPrismaToDTO<KycVerificationEntity>(v)))
  }

  async getByStatus(status: KycVerificationStatus): Promise<KycVerificationEntity[]> {
    const verifications = await prisma.kycVerification.findMany({
      where: {
        status: status.toDTO(),
      },
      include: {
        company: true,
        assignedUser: true,
      },
    })

    return verifications.map((v) => KycVerificationFactory.fromDTO(convertPrismaToDTO<KycVerificationEntity>(v)))
  }

  async getByAssignedUser(userId: UserId): Promise<KycVerificationEntity[]> {
    const verifications = await prisma.kycVerification.findMany({
      where: {
        assignedTo: userId.toDTO(),
      },
      include: {
        company: true,
        assignedUser: true,
      },
    })

    return verifications.map((v) => KycVerificationFactory.fromDTO(convertPrismaToDTO<KycVerificationEntity>(v)))
  }

  async getUnassigned(): Promise<KycVerificationEntity[]> {
    const verifications = await prisma.kycVerification.findMany({
      where: {
        assignedTo: null,
      },
      include: {
        company: true,
        assignedUser: true,
      },
    })

    return verifications.map((v) => KycVerificationFactory.fromDTO(convertPrismaToDTO<KycVerificationEntity>(v)))
  }

  async getAll(): Promise<KycVerificationEntity[]> {
    const verifications = await prisma.kycVerification.findMany({
      include: {
        company: true,
        assignedUser: true,
        kycPersons: true,
      },
    })

    return verifications.map((v) => KycVerificationFactory.fromDTO(convertPrismaToDTO<KycVerificationEntity>(v)))
  }

  async create(verification: KycVerificationEntity): Promise<KycVerificationEntity> {
    const verificationDTO = verification.toDTO()
    const { company, assignedUser, ...verificationData } = verificationDTO

    const createdVerification = await prisma.kycVerification.create({
      data: verificationData,
      include: {
        company: true,
        assignedUser: true,
      },
    })

    return KycVerificationFactory.fromDTO(convertPrismaToDTO<KycVerificationEntity>(createdVerification))
  }

  async save(verification: KycVerificationEntity): Promise<KycVerificationEntity> {
    const verificationDTO = verification.toDTO()
    const { company, assignedUser, ...verificationData } = verificationDTO

    const updatedVerification = await prisma.kycVerification.update({
      where: {
        id: verification.getId().toDTO(),
      },
      data: verificationData,
      include: {
        company: true,
        assignedUser: true,
      },
    })

    return KycVerificationFactory.fromDTO(convertPrismaToDTO<KycVerificationEntity>(updatedVerification))
  }

  async delete(id: KycVerificationId): Promise<boolean> {
    try {
      await prisma.kycVerification.delete({
        where: {
          id: id.toDTO(),
        },
      })
      return true
    } catch (error) {
      console.error('Error deleting KYC Verification:', error)
      return false
    }
  }

  async getPendingReviews(): Promise<KycVerificationEntity[]> {
    const verifications = await prisma.kycVerification.findMany({
      where: {
        status: 'requires-review'
      },
      include: {
        company: true,
        kycPersons: true,
        facetecResults: true,
        documents: true,
      },
    })

    return verifications.map((v) => KycVerificationFactory.fromDTO(convertPrismaToDTO<KycVerificationEntity>(v)))
  }

  async getPendingByCompany(companyId: string): Promise<KycVerificationEntity[]> {
    const verifications = await prisma.kycVerification.findMany({
      where: {
        companyId: companyId,
        status: 'pending'
      },
      include: {
        company: true,
        kycPersons: true,
        facetecResults: true,
        documents: true,
      },
    })

    return verifications.map((v) => KycVerificationFactory.fromDTO(convertPrismaToDTO<KycVerificationEntity>(v)))
  }
} 