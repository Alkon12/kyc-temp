import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { FacetecResultEntity } from '@domain/faceTec/models/FacetecResultEntity'
import type FacetecResultRepository from '@domain/faceTec/FacetecResultRepository'
import AbstractFacetecResultService from '@domain/faceTec/FacetecResultService'
import { FacetecResultId } from '@domain/faceTec/models/FacetecResultId'
import { CreateFacetecResultArgs } from '@domain/faceTec/interfaces/CreateFacetecResultArgs'
import { FacetecResultFactory } from '@domain/faceTec/FacetecResultFactory'
import { UpdateFacetecResultArgs } from '@domain/faceTec/interfaces/UpdateFacetecResultArgs'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { DateTimeValue } from '@domain/shared/DateTime'

@injectable()
export class FacetecResultService implements AbstractFacetecResultService {
  @inject(DI.FacetecResultRepository) private readonly _facetecResultRepository!: FacetecResultRepository

  async getById(facetecResultId: FacetecResultId): Promise<FacetecResultEntity> {
    return this._facetecResultRepository.getById(facetecResultId)
  }

  async getByVerificationId(verificationId: KycVerificationId): Promise<FacetecResultEntity[]> {
    return this._facetecResultRepository.getByVerificationId(verificationId)
  }

  async create(props: CreateFacetecResultArgs): Promise<FacetecResultEntity> {
    const facetecResult = FacetecResultFactory.create({
      verificationId: props.verificationId,
      sessionId: props.sessionId,
      livenessStatus: props.livenessStatus,
      enrollmentStatus: props.enrollmentStatus,
      matchLevel: props.matchLevel,
      fullResponse: props.fullResponse,
      manualReviewRequired: props.manualReviewRequired,
      createdAt: new DateTimeValue(new Date()),
    })

    return this._facetecResultRepository.create(facetecResult)
  }

  async update(props: UpdateFacetecResultArgs): Promise<FacetecResultEntity> {
    const facetecResult = await this._facetecResultRepository.getById(props.id)

    if (props.livenessStatus) {
      facetecResult.updateLivenessStatus(props.livenessStatus)
    }

    if (props.enrollmentStatus) {
      facetecResult.updateEnrollmentStatus(props.enrollmentStatus)
    }

    if (props.matchLevel) {
      facetecResult.updateMatchLevel(props.matchLevel)
    }

    if (props.manualReviewRequired !== undefined) {
      facetecResult.setManualReviewRequired(props.manualReviewRequired)
    }

    return this._facetecResultRepository.save(facetecResult)
  }
} 