import { KycVerificationEntity } from './models/KycVerificationEntity'
import { KycVerificationId } from './models/KycVerificationId'
import { CompanyId } from '@domain/company/models/CompanyId'
import { UserId } from '@domain/user/models/UserId'
import { KycVerificationStatus } from './models/KycVerificationStatus'

export default interface KycVerificationRepository {
  getById(id: KycVerificationId): Promise<KycVerificationEntity>
  getByExternalReferenceId(externalReferenceId: string, companyId: CompanyId): Promise<KycVerificationEntity | null>
  getByCompanyId(companyId: CompanyId): Promise<KycVerificationEntity[]>
  getByStatus(status: KycVerificationStatus): Promise<KycVerificationEntity[]>
  getByAssignedUser(userId: UserId): Promise<KycVerificationEntity[]>
  getUnassigned(): Promise<KycVerificationEntity[]>
  create(verification: KycVerificationEntity): Promise<KycVerificationEntity>
  save(verification: KycVerificationEntity): Promise<KycVerificationEntity>
  delete(id: KycVerificationId): Promise<boolean>
  getAll(): Promise<KycVerificationEntity[]>
  getPendingReviews(): Promise<KycVerificationEntity[]>
  getPendingByCompany(companyId: string): Promise<KycVerificationEntity[]>
}