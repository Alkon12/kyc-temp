import { injectable, inject } from 'inversify'
import type { ExternalVerificationRepository } from './ExternalVerificationRepository'
import { ExternalVerificationFactory, CreateExternalVerificationArgs } from './ExternalVerificationFactory'
import { ExternalVerification } from './models/ExternalVerification'
import { ExternalVerificationId } from './models/ExternalVerificationId'
import { ExternalVerificationEntity } from './models/ExternalVerificationEntity'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { JsonValue } from '@domain/shared/JsonValue'
import { ExternalVerificationStatus } from './models/ExternalVerificationStatus'
import { NotFoundError } from '@domain/error/NotFoundError'
import { DI } from '@infrastructure'

@injectable()
export class ExternalVerificationService {
  constructor(
    @inject(DI.ExternalVerificationRepository)
    private readonly externalVerificationRepository: ExternalVerificationRepository
  ) {}

  async create(args: CreateExternalVerificationArgs): Promise<ExternalVerification> {
    const externalVerification = ExternalVerificationFactory.create(args)
    await this.externalVerificationRepository.save(externalVerification)
    return externalVerification
  }

  async findById(id: string): Promise<ExternalVerificationEntity> {
    const externalVerificationId = new ExternalVerificationId(id)
    const externalVerification = await this.externalVerificationRepository.findById(externalVerificationId)
    
    if (!externalVerification) {
      throw new NotFoundError(`External verification with id ${id} not found`)
    }
    
    return externalVerification
  }

  async findByKycVerificationId(kycVerificationId: string): Promise<ExternalVerificationEntity[]> {
    const verificationId = new KycVerificationId(kycVerificationId)
    return await this.externalVerificationRepository.findByKycVerificationId(verificationId)
  }

  // Alias para compatibilidad con el resolver de KYC
  async getByVerificationId(kycVerificationId: KycVerificationId): Promise<ExternalVerificationEntity[]> {
    return await this.externalVerificationRepository.findByKycVerificationId(kycVerificationId)
  }

  async updateStatus(id: string, status: string): Promise<void> {
    const externalVerificationId = new ExternalVerificationId(id)
    const externalVerification = await this.externalVerificationRepository.findById(externalVerificationId)
    
    if (!externalVerification) {
      throw new NotFoundError(`External verification with id ${id} not found`)
    }
    
    externalVerification.updateStatus(new ExternalVerificationStatus(status))
    await this.externalVerificationRepository.save(
      ExternalVerificationFactory.create({
        id: externalVerification.getId().toDTO(),
        verificationId: externalVerification.getVerificationId().toDTO(),
        provider: externalVerification.getProvider().toDTO(),
        verificationType: externalVerification.getVerificationType().toDTO(),
        status: externalVerification.getStatus().toDTO(),
        requestData: externalVerification.getRequestData()?.getJson(),
        responseData: externalVerification.getResponseData()?.getJson()
      })
    )
  }

  async updateResponseData(id: string, responseData: object): Promise<void> {
    const externalVerificationId = new ExternalVerificationId(id)
    const externalVerification = await this.externalVerificationRepository.findById(externalVerificationId)
    
    if (!externalVerification) {
      throw new NotFoundError(`External verification with id ${id} not found`)
    }
    
    externalVerification.updateResponseData(new JsonValue(responseData))
    await this.externalVerificationRepository.save(
      ExternalVerificationFactory.create({
        id: externalVerification.getId().toDTO(),
        verificationId: externalVerification.getVerificationId().toDTO(),
        provider: externalVerification.getProvider().toDTO(),
        verificationType: externalVerification.getVerificationType().toDTO(),
        status: externalVerification.getStatus().toDTO(),
        requestData: externalVerification.getRequestData()?.getJson(),
        responseData: responseData
      })
    )
  }

  async delete(id: string): Promise<void> {
    const externalVerificationId = new ExternalVerificationId(id)
    await this.externalVerificationRepository.delete(externalVerificationId)
  }
} 