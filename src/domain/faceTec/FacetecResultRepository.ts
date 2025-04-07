import { FacetecResultEntity } from './models/FacetecResultEntity'
import { FacetecResultId } from './models/FacetecResultId'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'

export default interface FacetecResultRepository {
  getById(facetecResultId: FacetecResultId): Promise<FacetecResultEntity>
  getByVerificationId(verificationId: KycVerificationId): Promise<FacetecResultEntity[]>
  create(facetecResult: FacetecResultEntity): Promise<FacetecResultEntity>
  save(facetecResult: FacetecResultEntity): Promise<FacetecResultEntity>
} 