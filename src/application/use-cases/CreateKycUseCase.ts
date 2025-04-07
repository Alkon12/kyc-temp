import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { KycVerificationFactory } from '@domain/kycVerification/KycVerificationFactory'
import type KycVerificationRepository from '@domain/kycVerification/KycVerificationRepository'
import { KycVerificationType } from '@domain/kycVerification/models/KycVerificationType'
import { KycVerificationStatus } from '@domain/kycVerification/models/KycVerificationStatus'
import { CompanyId } from '@domain/company/models/CompanyId'
import { StringValue } from '@domain/shared/StringValue'
import { NumberValue } from '@domain/shared/NumberValue'
import { KycPersonFactory } from '@domain/kycPerson/KycPersonFactory'
import type KycPersonRepository from '@domain/kycPerson/KycPersonRepository'
import { UserId } from '@domain/user/models/UserId'
import { DateTimeValue } from '@domain/shared/DateTime'

export interface CreateKycVerificationDto {
  companyId?: string
  externalReferenceId?: string
  verificationType: string
  priority?: number
  riskLevel?: string
  notes?: string
  personInfo?: {
    firstName?: string
    lastName?: string
    dateOfBirth?: string
    nationality?: string
    documentNumber?: string
    documentType?: string
    email?: string
    phone?: string
    address?: string
  }
  assignToUserId?: string
}

@injectable()
export class CreateKycUseCase {
  constructor(
    @inject(DI.KycVerificationRepository) private kycVerificationRepository: KycVerificationRepository,
    @inject(DI.KycPersonRepository) private kycPersonRepository: KycPersonRepository
  ) {}

  async execute(dto: CreateKycVerificationDto) {
    // Validar que companyId exista
    if (!dto.companyId) {
      throw new Error('Company ID is required')
    }
    
    // Crear la verificación KYC
    const kycVerification = KycVerificationFactory.create({
      companyId: new CompanyId(dto.companyId),
      verificationType: new KycVerificationType(dto.verificationType),
      status: new KycVerificationStatus('pending'),
      priority: new NumberValue(dto.priority || 0),
      riskLevel: dto.riskLevel ? new StringValue(dto.riskLevel) : undefined,
      notes: dto.notes ? new StringValue(dto.notes) : undefined,
      externalReferenceId: dto.externalReferenceId ? new StringValue(dto.externalReferenceId) : undefined,
      assignedTo: dto.assignToUserId ? new UserId(dto.assignToUserId) : undefined,
    })

    // Guardar la verificación KYC primero
    const createdVerification = await this.kycVerificationRepository.create(kycVerification)

    // Si hay información de persona, crear y asociar a la verificación
    if (dto.personInfo) {
      const kycPerson = KycPersonFactory.create({
        verificationId: createdVerification.getId(),
        firstName: dto.personInfo.firstName ? new StringValue(dto.personInfo.firstName) : undefined,
        lastName: dto.personInfo.lastName ? new StringValue(dto.personInfo.lastName) : undefined,
        dateOfBirth: dto.personInfo.dateOfBirth ? new DateTimeValue(dto.personInfo.dateOfBirth) : undefined,
        nationality: dto.personInfo.nationality ? new StringValue(dto.personInfo.nationality) : undefined,
        documentNumber: dto.personInfo.documentNumber ? new StringValue(dto.personInfo.documentNumber) : undefined,
        documentType: dto.personInfo.documentType ? new StringValue(dto.personInfo.documentType) : undefined,
        email: dto.personInfo.email ? new StringValue(dto.personInfo.email) : undefined,
        phone: dto.personInfo.phone ? new StringValue(dto.personInfo.phone) : undefined,
        address: dto.personInfo.address ? new StringValue(dto.personInfo.address) : undefined,
      })

      await this.kycPersonRepository.create(kycPerson)
    }

    return createdVerification
  }
}