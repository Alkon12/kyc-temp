import prisma from '@client/providers/PrismaClient'
import { nullsToUndefined } from '@/client/utils/nullToUndefined'
import { DTO } from '@domain/kernel/DTO'
import { IParamHeader } from '@type/entities'
import { ParamHeaderEntity } from '@domain/paramheader/ParamHeaderEntity'
import { ParamHeaderFactory } from '@domain/paramheader/ParamHeaderFactory'
import ParamHeaderRepository from '@domain/paramheader/ParamHeaderRepository'
import { StringValue } from '@domain/shared/StringValue'
import { injectable } from 'inversify'

@injectable()
export class PrismaParamHeaderRepository implements ParamHeaderRepository {
  async findParamHeaderByIdParam(id: StringValue): Promise<ParamHeaderEntity | null> {
    const registro = await prisma.paramHeader.findUnique({
      where: {
        id: id.toDTO(),
      },
      include: {
        paramDetails: true,
      },
    })

    if (!registro) throw 'No se encontró parámetro configurado'

    return ParamHeaderFactory.fromDTO(nullsToUndefined(registro as unknown as IParamHeader))
  }
}
