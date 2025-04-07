import { StringValue } from '@domain/shared/StringValue'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { NumberValue } from '@domain/shared/NumberValue'
import { FacetecResultId } from '../models/FacetecResultId'

export interface UpdateFacetecResultArgs {
  id: FacetecResultId
  livenessStatus?: StringValue
  enrollmentStatus?: StringValue
  matchLevel?: NumberValue
  manualReviewRequired?: BooleanValue
} 