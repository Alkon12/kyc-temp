import { ValueObject } from '../../kernel/ValueObject'
import { ValidationError } from '../../error/ValidationError'

export const SCORE_RESOLUTIONS = {
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  BACKOFFICE_REVIEW: 'BACKOFFICE_REVIEW',
  MANAGER_REVIEW: 'MANAGER_REVIEW',
}

export class ScoringResolution extends ValueObject<'ScoringResolution', string> {
  constructor(value: string) {
    const valid = Object.values(SCORE_RESOLUTIONS)
    if (!valid.includes(value)) {
      throw new ValidationError(`Invalid ScoringResolution [${value}], must be one of "${valid.join()}"`)
    }
    super(value)
  }

  static get(value: ScoringResolution | string): ScoringResolution {
    return typeof value === 'string' ? new ScoringResolution(value) : value
  }

  static APPROVE = new ScoringResolution(SCORE_RESOLUTIONS.APPROVE)
  static REJECT = new ScoringResolution(SCORE_RESOLUTIONS.REJECT)
  static BACKOFFICE_REVIEW = new ScoringResolution(SCORE_RESOLUTIONS.BACKOFFICE_REVIEW)
  static MANAGER_REVIEW = new ScoringResolution(SCORE_RESOLUTIONS.MANAGER_REVIEW)
}
