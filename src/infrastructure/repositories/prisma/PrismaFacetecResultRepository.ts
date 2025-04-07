import prisma from '@client/providers/PrismaClient'
import type FacetecResultRepository from '@domain/faceTec/FacetecResultRepository'
import { FacetecResultFactory } from '@domain/faceTec/FacetecResultFactory'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { FacetecResultEntity } from '@domain/faceTec/models/FacetecResultEntity'
import { injectable } from 'inversify'
import { FacetecResultId } from '@domain/faceTec/models/FacetecResultId'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { NotFoundError } from '@domain/error'
import { Prisma } from '@prisma/client'

@injectable()
export class PrismaFacetecResultRepository implements FacetecResultRepository {
  async getById(facetecResultId: FacetecResultId): Promise<FacetecResultEntity> {
    const facetecResult = await prisma.facetecResult.findUnique({
      where: {
        id: facetecResultId.toDTO(),
      },
      include: {
        kycVerification: true,
      },
    })

    if (!facetecResult) {
      throw new NotFoundError('FacetecResult not found')
    }

    return FacetecResultFactory.fromDTO(convertPrismaToDTO<FacetecResultEntity>(facetecResult))
  }

  async getByVerificationId(verificationId: KycVerificationId): Promise<FacetecResultEntity[]> {
    const facetecResults = await prisma.facetecResult.findMany({
      where: {
        verificationId: verificationId.toDTO(),
      },
      include: {
        kycVerification: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return facetecResults.map((result) => 
      FacetecResultFactory.fromDTO(convertPrismaToDTO<FacetecResultEntity>(result))
    )
  }

  async create(facetecResult: FacetecResultEntity): Promise<FacetecResultEntity> {
    const dto = facetecResult.toDTO()
    
    // Preparar los datos usando Prisma.JsonValue
    const data: any = {
      id: dto.id,
      verificationId: dto.verificationId,
      sessionId: dto.sessionId,
      livenessStatus: dto.livenessStatus,
      enrollmentStatus: dto.enrollmentStatus,
      manualReviewRequired: dto.manualReviewRequired,
    }
    
    // Solo agregar matchLevel si existe
    if (dto.matchLevel !== undefined) {
      data.matchLevel = dto.matchLevel
    }
    
    // Solo agregar fullResponse si existe
    if (dto.fullResponse !== undefined) {
      data.fullResponse = dto.fullResponse as unknown as Prisma.JsonValue
    }
    
    const createdFacetecResult = await prisma.facetecResult.create({
      data,
    })

    return FacetecResultFactory.fromDTO(convertPrismaToDTO<FacetecResultEntity>(createdFacetecResult))
  }

  async save(facetecResult: FacetecResultEntity): Promise<FacetecResultEntity> {
    const dto = facetecResult.toDTO()
    
    // Preparar los datos usando Prisma.JsonValue
    const data: any = {
      livenessStatus: dto.livenessStatus,
      enrollmentStatus: dto.enrollmentStatus,
      manualReviewRequired: dto.manualReviewRequired,
    }
    
    // Solo agregar matchLevel si existe
    if (dto.matchLevel !== undefined) {
      data.matchLevel = dto.matchLevel
    }
    
    // Solo agregar fullResponse si existe
    if (dto.fullResponse !== undefined) {
      data.fullResponse = dto.fullResponse as unknown as Prisma.JsonValue
    }
    
    const updatedFacetecResult = await prisma.facetecResult.update({
      where: {
        id: facetecResult.getId().toDTO(),
      },
      data,
      include: {
        kycVerification: true,
      },
    })

    return FacetecResultFactory.fromDTO(convertPrismaToDTO<FacetecResultEntity>(updatedFacetecResult))
  }
} 