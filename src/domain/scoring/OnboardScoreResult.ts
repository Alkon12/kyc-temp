import { ChecklistId } from '@domain/checklist/models/ChecklistId'
import { ScoringMark } from './models/ScoringMark'
import { ScoringResolution } from './models/ScoringResolution'
import { StringValue } from '@domain/shared/StringValue'
import { JsonValue } from '@domain/shared/JsonValue'

interface OnboardScoreResult {
  ref: StringValue
  verdict: JsonValue
  brief: JsonValue
  details: JsonValue
  analysis: JsonValue
  mark: ScoringMark
  resolution: ScoringResolution
  checkList: ChecklistId[]
}

export default OnboardScoreResult
