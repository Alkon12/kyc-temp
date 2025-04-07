import { FacetecResultEntity } from './models/FacetecResultEntity'
import { FacetecResultId } from './models/FacetecResultId'
import { CreateFacetecResultArgs } from './interfaces/CreateFacetecResultArgs'
import { UpdateFacetecResultArgs } from './interfaces/UpdateFacetecResultArgs'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'

export default abstract class AbstractFacetecResultService {
  abstract getById(facetecResultId: FacetecResultId): Promise<FacetecResultEntity>
  abstract getByVerificationId(verificationId: KycVerificationId): Promise<FacetecResultEntity[]>
  abstract create(props: CreateFacetecResultArgs): Promise<FacetecResultEntity>
  abstract update(props: UpdateFacetecResultArgs): Promise<FacetecResultEntity>
} 