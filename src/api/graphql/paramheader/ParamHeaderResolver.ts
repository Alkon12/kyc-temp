import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import { QueryFindParamHeaderByIdParamArgs } from '../app.schema.gen'
import { ParamHeaderEntity } from '@domain/paramheader/ParamHeaderEntity'
import { ParamHeaderService } from '@service/ParamHeaderService'

@injectable()
export class ParamHeaderResolvers {
  build() {
    return {
      Query: {
        findParamHeaderByIdParam: this.findParamHeaderByIdParam,
      },
    }
  }

  findParamHeaderByIdParam = async (
    _parent: unknown,
    { id }: QueryFindParamHeaderByIdParamArgs,
  ): Promise<DTO<ParamHeaderEntity | null>> => {
    const paramservice = container.get<ParamHeaderService>(DI.ParamHeaderService)
    const reg = await paramservice.findParamHeaderByIdParam(id)

    return reg
  }
}
