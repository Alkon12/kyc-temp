import { StringValue } from '@domain/shared/StringValue'
import { ParamHeaderEntity } from './ParamHeaderEntity'

export default interface ParamHeaderRepository {
  findParamHeaderByIdParam(id: StringValue): Promise<ParamHeaderEntity | null>
}
