import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import type ParamHeaderRepository from '@domain/paramheader/ParamHeaderRepository'
import { ParamHeaderEntity } from '@domain/paramheader/ParamHeaderEntity'
import { StringValue } from '@domain/shared/StringValue'
import AbstractParamHeaderService from '@domain/paramheader/ParamHeaderService'

@injectable()
export class ParamHeaderService implements AbstractParamHeaderService {
  @inject(DI.ParamHeaderRepository)
  private readonly _paramHeaderRepository!: ParamHeaderRepository

  async findParamHeaderByIdParam(id: DTO<StringValue>): Promise<DTO<ParamHeaderEntity | null>> {
    const param = await this._paramHeaderRepository.findParamHeaderByIdParam(new StringValue(id))

    return param && param.toDTO()
  }
}
