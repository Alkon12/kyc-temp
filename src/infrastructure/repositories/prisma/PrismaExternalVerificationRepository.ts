import prisma from '@client/providers/PrismaClient'
import { injectable } from 'inversify'
import { ExternalVerificationRepository } from '@domain/externalVerification/ExternalVerificationRepository'
import { ExternalVerification } from '@domain/externalVerification/models/ExternalVerification'
import { ExternalVerificationEntity } from '@domain/externalVerification/models/ExternalVerificationEntity'
import { ExternalVerificationId } from '@domain/externalVerification/models/ExternalVerificationId'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { ExternalVerificationFactory } from '@domain/externalVerification/ExternalVerificationFactory'
import { NotFoundError } from '@domain/error/NotFoundError'
import { StringValue } from '@domain/shared/StringValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { ExternalVerificationStatus } from '@domain/externalVerification/models/ExternalVerificationStatus'
import { ExternalVerificationType } from '@domain/externalVerification/models/ExternalVerificationType'
import { JsonValue } from '@domain/shared/JsonValue'

@injectable()
export class PrismaExternalVerificationRepository implements ExternalVerificationRepository {
  async findById(id: ExternalVerificationId): Promise<ExternalVerificationEntity | null> {
    const externalVerification = await prisma.externalVerification.findUnique({
      where: {
        id: id.toDTO(),
      },
      include: {
        kycVerification: true,
      },
    })

    if (!externalVerification) {
      return null
    }

    // Create the entity directly
    const entity = new ExternalVerificationEntity({
      id: new ExternalVerificationId(externalVerification.id),
      verificationId: new KycVerificationId(externalVerification.verificationId),
      provider: new StringValue(externalVerification.provider),
      verificationType: new ExternalVerificationType(externalVerification.verificationType),
      status: new ExternalVerificationStatus(externalVerification.status || 'pending'),
      createdAt: new DateTimeValue(externalVerification.createdAt),
    })

    if (externalVerification.requestData) {
      // Convert to string first to handle any type safely
      entity.props.requestData = new JsonValue(JSON.stringify(externalVerification.requestData))
    }

    if (externalVerification.responseData) {
      // Convert to string first to handle any type safely
      entity.props.responseData = new JsonValue(JSON.stringify(externalVerification.responseData))
    }

    return entity
  }

  async findByKycVerificationId(kycVerificationId: KycVerificationId): Promise<ExternalVerificationEntity[]> {
    const externalVerifications = await prisma.externalVerification.findMany({
      where: {
        verificationId: kycVerificationId.toDTO(),
      },
      include: {
        kycVerification: true,
      },
    })

    return externalVerifications.map((ev) => {
      // Create the entity directly
      const entity = new ExternalVerificationEntity({
        id: new ExternalVerificationId(ev.id),
        verificationId: new KycVerificationId(ev.verificationId),
        provider: new StringValue(ev.provider),
        verificationType: new ExternalVerificationType(ev.verificationType),
        status: new ExternalVerificationStatus(ev.status || 'pending'),
        createdAt: new DateTimeValue(ev.createdAt),
      })

      if (ev.requestData) {
        // Convert to string first to handle any type safely
        entity.props.requestData = new JsonValue(JSON.stringify(ev.requestData))
      }

      if (ev.responseData) {
        // Convert to string first to handle any type safely
        entity.props.responseData = new JsonValue(JSON.stringify(ev.responseData))
      }

      return entity
    })
  }

  async save(externalVerification: ExternalVerification): Promise<void> {
    const data = externalVerification.toDTO()
    
    await prisma.externalVerification.upsert({
      where: {
        id: data.id,
      },
      update: {
        provider: data.provider,
        verificationType: data.verificationType,
        requestData: data.requestData,
        responseData: data.responseData,
        status: data.status,
      },
      create: {
        id: data.id,
        verificationId: data.verificationId,
        provider: data.provider,
        verificationType: data.verificationType,
        requestData: data.requestData,
        responseData: data.responseData,
        status: data.status,
      },
    })
  }

  async delete(id: ExternalVerificationId): Promise<void> {
    try {
      await prisma.externalVerification.delete({
        where: {
          id: id.toDTO(),
        },
      })
    } catch (error) {
      throw new NotFoundError(`External verification with id ${id.toDTO()} not found`)
    }
  }
} 