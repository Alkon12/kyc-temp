import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import type KycVerificationRepository from '@domain/kycVerification/KycVerificationRepository'
import type AbstractKycVerificationService from '@domain/kycVerification/KycVerificationService'
import { KycVerificationEntity } from '@domain/kycVerification/models/KycVerificationEntity'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { KycVerificationStatus } from '@domain/kycVerification/models/KycVerificationStatus'
import { KycVerificationType } from '@domain/kycVerification/models/KycVerificationType'
import { CompanyId } from '@domain/company/models/CompanyId'
import { UserId } from '@domain/user/models/UserId'
import { StringValue } from '@domain/shared/StringValue'
import { NumberValue } from '@domain/shared/NumberValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { KycVerificationFactory } from '@domain/kycVerification/KycVerificationFactory'
import type { CreateKycVerificationArgs } from '@domain/kycVerification/interfaces/CreateKycVerificationArgs'
import { UUID } from '@domain/shared/UUID'

@injectable()
export class KycVerificationService implements AbstractKycVerificationService {
  constructor(
    @inject(DI.KycVerificationRepository)
    private readonly _kycVerificationRepository: KycVerificationRepository
  ) {}

  async getById(id: KycVerificationId): Promise<KycVerificationEntity> {
    const verification = await this._kycVerificationRepository.getById(id)
    if (!verification) {
      throw new Error('KYC verification not found')
    }
    return verification
  }

  async getByExternalReferenceId(externalReferenceId: string, companyId: CompanyId): Promise<KycVerificationEntity | null> {
    return this._kycVerificationRepository.getByExternalReferenceId(externalReferenceId, companyId)
  }

  async getByCompanyId(companyId: CompanyId): Promise<KycVerificationEntity[]> {
    return this._kycVerificationRepository.getByCompanyId(companyId)
  }

  async getByStatus(status: KycVerificationStatus): Promise<KycVerificationEntity[]> {
    return this._kycVerificationRepository.getByStatus(status)
  }

  async getByAssignedUser(userId: UserId): Promise<KycVerificationEntity[]> {
    return this._kycVerificationRepository.getByAssignedUser(userId)
  }

  async getUnassigned(): Promise<KycVerificationEntity[]> {
    return this._kycVerificationRepository.getUnassigned()
  }

  async getPendingReviews(): Promise<KycVerificationEntity[]> {
    return this._kycVerificationRepository.getPendingReviews()
  }

  async getPendingByCompany(companyId: string): Promise<KycVerificationEntity[]> {
    return this._kycVerificationRepository.getPendingByCompany(companyId)
  }

  async getAll(): Promise<KycVerificationEntity[]> {
    // Use the repository instead of directly accessing Prisma
    return this._kycVerificationRepository.getAll()
  }

  async getPendingVerifications(): Promise<KycVerificationEntity[]> {
    return this._kycVerificationRepository.getByStatus(new KycVerificationStatus('pending'))
  }

  async create(args: CreateKycVerificationArgs): Promise<KycVerificationEntity> {
    const verification = KycVerificationFactory.create({
      externalReferenceId: args.externalReferenceId,
      companyId: args.companyId,
      verificationType: args.verificationType,
      riskLevel: args.riskLevel,
      notes: args.notes,
      priority: new NumberValue(0),
      status: new KycVerificationStatus('pending')
    })
    return this._kycVerificationRepository.create(verification)
  }

  async update(id: KycVerificationId, args: Partial<CreateKycVerificationArgs>): Promise<KycVerificationEntity> {
    const verification = await this.getById(id)
    const props = verification.props

    const updatedVerification = KycVerificationFactory.create({
      id: new UUID(props.id._value),
      externalReferenceId: args.externalReferenceId || props.externalReferenceId,
      companyId: args.companyId || props.companyId,
      verificationType: args.verificationType || props.verificationType,
      riskLevel: args.riskLevel || props.riskLevel,
      notes: args.notes || props.notes,
      priority: props.priority,
      status: props.status
    })

    return this._kycVerificationRepository.save(updatedVerification)
  }

  async updateStatus(id: KycVerificationId, status: KycVerificationStatus, notes?: StringValue): Promise<KycVerificationEntity> {
    const verification = await this.getById(id)
    verification.updateStatus(status)
    
    if (notes) {
      verification.updateNotes(notes)
    }
    
    return this._kycVerificationRepository.save(verification)
  }

  async assignToUser(id: KycVerificationId, userId: UserId): Promise<KycVerificationEntity> {
    const verification = await this.getById(id)
    verification.assign(userId)
    return this._kycVerificationRepository.save(verification)
  }

  async unassignFromUser(id: KycVerificationId): Promise<KycVerificationEntity> {
    const verification = await this.getById(id)
    verification.unassign()
    return this._kycVerificationRepository.save(verification)
  }

  async delete(id: KycVerificationId): Promise<boolean> {
    await this._kycVerificationRepository.delete(id)
    return true
  }
} 