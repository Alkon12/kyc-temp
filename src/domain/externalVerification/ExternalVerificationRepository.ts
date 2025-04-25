import { ExternalVerification } from './models/ExternalVerification'
import { ExternalVerificationEntity } from './models/ExternalVerificationEntity'
import { ExternalVerificationId } from './models/ExternalVerificationId'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'

export interface ExternalVerificationRepository {
  findById(id: ExternalVerificationId): Promise<ExternalVerificationEntity | null>
  findByKycVerificationId(kycVerificationId: KycVerificationId): Promise<ExternalVerificationEntity[]>
  save(externalVerification: ExternalVerification): Promise<void>
  delete(id: ExternalVerificationId): Promise<void>
} 