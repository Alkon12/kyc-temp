import { ValueObject } from '../../kernel/ValueObject'
import { ValidationError } from '../../error/ValidationError'

export const MARKS = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
  F: 'F',
}

export class ScoringMark extends ValueObject<'ScoringMark', string> {
  constructor(scoringMark: string) {
    const valid = Object.values(MARKS)
    if (!valid.includes(scoringMark)) {
      throw new ValidationError(`Invalid scoringMark [${scoringMark}], must be one of "${valid.join()}"`)
    }
    super(scoringMark)
  }

  static get(scoringMark: ScoringMark | string): ScoringMark {
    return typeof scoringMark === 'string' ? new ScoringMark(scoringMark) : scoringMark
  }

  static A = new ScoringMark(MARKS.A)
  static B = new ScoringMark(MARKS.B)
  static C = new ScoringMark(MARKS.C)
  static D = new ScoringMark(MARKS.D)
  static E = new ScoringMark(MARKS.E)
  static F = new ScoringMark(MARKS.F)
}
