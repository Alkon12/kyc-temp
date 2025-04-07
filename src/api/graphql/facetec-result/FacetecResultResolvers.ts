import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import { FacetecResultId } from '@domain/faceTec/models/FacetecResultId'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { QueryGetFacetecResultByIdArgs, QueryGetFacetecResultsByVerificationIdArgs } from '../app.schema.gen'
import AbstractFacetecResultService from '@domain/faceTec/FacetecResultService'
import { FacetecResultEntity } from '@domain/faceTec/models/FacetecResultEntity'

@injectable()
export class FacetecResultResolvers {
  build() {
    return {
      Query: {
        getFacetecResultById: this.getFacetecResultById,
        getFacetecResultsByVerificationId: this.getFacetecResultsByVerificationId,
      },
    }
  }

  getFacetecResultById = async (_parent: unknown, { facetecResultId }: QueryGetFacetecResultByIdArgs): Promise<DTO<FacetecResultEntity>> => {
    const facetecResultService = container.get<AbstractFacetecResultService>(DI.FacetecResultService)

    const facetecResult = await facetecResultService.getById(new FacetecResultId(facetecResultId))

    return facetecResult.toDTO()
  }

  getFacetecResultsByVerificationId = async (
    _parent: unknown,
    { verificationId }: QueryGetFacetecResultsByVerificationIdArgs
  ): Promise<DTO<FacetecResultEntity>[]> => {
    const facetecResultService = container.get<AbstractFacetecResultService>(DI.FacetecResultService)

    const facetecResults = await facetecResultService.getByVerificationId(new KycVerificationId(verificationId))

    return facetecResults.map((result) => result.toDTO())
  }
} 