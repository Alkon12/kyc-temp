import prisma from '@client/providers/PrismaClient'
import type VerificationLinkRepository from '@domain/verification-link/VerificationLinkRepository'
import { VerificationLinkFactory } from '@domain/verification-link/VerificationLinkFactory'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { VerificationLinkEntity } from '@domain/verification-link/models/VerificationLinkEntity'
import { injectable } from 'inversify'
import { VerificationLinkId } from '@domain/verification-link/models/VerificationLinkId'
import { NotFoundError } from '@domain/error'
import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'

@injectable()
export class PrismaVerificationLinkRepository implements VerificationLinkRepository {
  async getById(verificationLinkId: VerificationLinkId): Promise<VerificationLinkEntity> {
    const verificationLink = await prisma.verificationLink.findUnique({
      where: {
        id: verificationLinkId.toDTO(),
      },
      include: {
        kycVerification: true,
      },
    })

    if (!verificationLink) {
      throw new NotFoundError('VerificationLink not found')
    }

    return VerificationLinkFactory.fromDTO(convertPrismaToDTO<VerificationLinkEntity>(verificationLink))
  }

  async getByToken(token: StringValue): Promise<VerificationLinkEntity> {
    const verificationLink = await prisma.verificationLink.findUnique({
      where: {
        token: token.toDTO(),
      },
      include: {
        kycVerification: true,
      },
    })

    if (!verificationLink) {
      throw new NotFoundError('VerificationLink not found')
    }

    return VerificationLinkFactory.fromDTO(convertPrismaToDTO<VerificationLinkEntity>(verificationLink))
  }

  async getByVerificationId(verificationId: UUID): Promise<VerificationLinkEntity[]> {
    const verificationLinks = await prisma.verificationLink.findMany({
      where: {
        verificationId: verificationId.toDTO(),
      },
      include: {
        kycVerification: true,
      },
    })

    return verificationLinks.map((link) => 
      VerificationLinkFactory.fromDTO(convertPrismaToDTO<VerificationLinkEntity>(link))
    )
  }

  async create(verificationLink: VerificationLinkEntity): Promise<VerificationLinkEntity> {
    const dto = verificationLink.toDTO()
    
    console.log('Creating verification link in repository with data:', {
      id: dto.id,
      verificationId: dto.verificationId,
    });
    
    const createdVerificationLink = await prisma.verificationLink.create({
      data: {
        id: dto.id,
        verificationId: dto.verificationId,
        token: dto.token,
        status: dto.status,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        lastAccessedAt: dto.lastAccessedAt ? new Date(dto.lastAccessedAt) : null,
        accessCount: parseInt(dto.accessCount),
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
      },
      include: {
        kycVerification: true,
      },
    })
    
    console.log('Created verification link in repository:', {
      id: createdVerificationLink.id,
      verificationId: createdVerificationLink.verificationId,
    });

    return VerificationLinkFactory.fromDTO(convertPrismaToDTO<VerificationLinkEntity>(createdVerificationLink))
  }

  async save(verificationLink: VerificationLinkEntity): Promise<VerificationLinkEntity> {
    const dto = verificationLink.toDTO()
    
    const updatedVerificationLink = await prisma.verificationLink.update({
      where: {
        id: dto.id,
      },
      data: {
        token: dto.token,
        status: dto.status,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        lastAccessedAt: dto.lastAccessedAt ? new Date(dto.lastAccessedAt) : null,
        accessCount: parseInt(dto.accessCount),
        updatedAt: new Date(dto.updatedAt),
      },
      include: {
        kycVerification: true,
      },
    })

    return VerificationLinkFactory.fromDTO(convertPrismaToDTO<VerificationLinkEntity>(updatedVerificationLink))
  }
} 