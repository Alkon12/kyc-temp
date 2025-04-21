import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import { FacetecResultId } from '@domain/faceTec/models/FacetecResultId'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { 
  QueryGetFacetecResultByIdArgs, 
  QueryGetFacetecResultsByVerificationIdArgs,
  MutationCreateFacetecResultArgs,
  MutationUpdateFacetecResultArgs
} from '../app.schema.gen'
import AbstractFacetecResultService from '@domain/faceTec/FacetecResultService'
import { FacetecResultEntity } from '@domain/faceTec/models/FacetecResultEntity'
import { StringValue } from '@domain/shared/StringValue'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { NumberValue } from '@domain/shared/NumberValue'
import { JsonValue } from '@domain/shared/JsonValue'
import { FaceTecSessionId } from '@domain/faceTec/models/FaceTecSessionId'

@injectable()
export class FacetecResultResolvers {
  build() {
    return {
      Query: {
        getFacetecResultById: this.getFacetecResultById,
        getFacetecResultsByVerificationId: this.getFacetecResultsByVerificationId,
      },
      Mutation: {
        createFacetecResult: this.createFacetecResult,
        updateFacetecResult: this.updateFacetecResult,
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

  createFacetecResult = async (
    _parent: unknown,
    { input }: MutationCreateFacetecResultArgs
  ): Promise<DTO<FacetecResultEntity>> => {
    const facetecResultService = container.get<AbstractFacetecResultService>(DI.FacetecResultService)

    const facetecResult = await facetecResultService.create({
      verificationId: new KycVerificationId(input.verificationId),
      sessionId: new FaceTecSessionId(input.sessionId),
      livenessStatus: new StringValue(input.livenessStatus),
      enrollmentStatus: new StringValue(input.enrollmentStatus),
      matchLevel: input.matchLevel !== undefined && input.matchLevel !== null 
        ? new NumberValue(input.matchLevel) 
        : undefined,
      fullResponse: input.fullResponse 
        ? new JsonValue(input.fullResponse) 
        : undefined,
      manualReviewRequired: new BooleanValue(input.manualReviewRequired),
    })

    return facetecResult.toDTO()
  }

  updateFacetecResult = async (
    _parent: unknown,
    { input }: MutationUpdateFacetecResultArgs
  ): Promise<DTO<FacetecResultEntity>> => {
    const facetecResultService = container.get<AbstractFacetecResultService>(DI.FacetecResultService)

    const matchLevel = input.matchLevel !== undefined && input.matchLevel !== null 
      ? new NumberValue(input.matchLevel) 
      : undefined;

    const updateData: any = {
      id: new FacetecResultId(input.id),
      livenessStatus: input.livenessStatus 
        ? new StringValue(input.livenessStatus) 
        : undefined,
      enrollmentStatus: input.enrollmentStatus 
        ? new StringValue(input.enrollmentStatus) 
        : undefined,
      matchLevel: matchLevel,
      manualReviewRequired: input.manualReviewRequired !== undefined 
        ? new BooleanValue(input.manualReviewRequired) 
        : undefined,
    };

    if (input.fullResponse !== undefined) {
      updateData.fullResponse = new JsonValue(input.fullResponse);
    }

    console.log('Updating facetec result with data:', {
      id: input.id,
      hasFullResponse: input.fullResponse !== undefined,
      matchLevel: input.matchLevel
    });

    const facetecResult = await facetecResultService.update(updateData);

    return facetecResult.toDTO()
  }
} 