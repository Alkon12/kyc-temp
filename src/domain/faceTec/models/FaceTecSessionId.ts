import { StringValueAbstract } from '@domain/shared/base/StringValueAbstract'

export class FaceTecSessionId extends StringValueAbstract<'FaceTecSessionId'> {
  constructor(value: string) {
    super(value)
  }
}
