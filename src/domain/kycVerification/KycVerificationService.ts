import { KycVerificationEntity } from './models/KycVerificationEntity'
import { KycVerificationId } from './models/KycVerificationId'
import { CompanyId } from '@domain/company/models/CompanyId'
import { UserId } from '@domain/user/models/UserId'
import { KycVerificationStatus } from './models/KycVerificationStatus'
import { CreateKycVerificationArgs } from './interfaces/CreateKycVerificationArgs'
import { StringValue } from '@domain/shared/StringValue'

export default abstract class AbstractKycVerificationService {
  abstract getById(id: KycVerificationId): Promise<KycVerificationEntity>
  abstract getByExternalReferenceId(externalReferenceId: string, companyId: CompanyId): Promise<KycVerificationEntity | null>
  abstract getByCompanyId(companyId: CompanyId): Promise<KycVerificationEntity[]>
  abstract getByStatus(status: KycVerificationStatus): Promise<KycVerificationEntity[]>
  abstract getByAssignedUser(userId: UserId): Promise<KycVerificationEntity[]>
  abstract getUnassigned(): Promise<KycVerificationEntity[]>
  abstract create(props: CreateKycVerificationArgs): Promise<KycVerificationEntity>
  abstract update(id: KycVerificationId, props: Partial<CreateKycVerificationArgs>): Promise<KycVerificationEntity>
  abstract updateStatus(id: KycVerificationId, status: KycVerificationStatus, notes?: StringValue): Promise<KycVerificationEntity>
  abstract assignToUser(id: KycVerificationId, userId: UserId): Promise<KycVerificationEntity>
  abstract unassignFromUser(id: KycVerificationId): Promise<KycVerificationEntity>
  abstract delete(id: KycVerificationId): Promise<boolean>
  abstract getAll(): Promise<KycVerificationEntity[]>
  abstract getPendingVerifications(): Promise<KycVerificationEntity[]>
  abstract getPendingReviews(): Promise<KycVerificationEntity[]>
  abstract getPendingByCompany(companyId: string): Promise<KycVerificationEntity[]>
} 