import { DTO } from '@domain/kernel/DTO'
import { StringValue } from '@domain/shared/StringValue'
import { ParamHeader } from '@prisma/client'

export default abstract class AbstractParamHeaderService {
  abstract findParamHeaderByIdParam(id: DTO<StringValue>): Promise<DTO<ParamHeader | null>>
}
