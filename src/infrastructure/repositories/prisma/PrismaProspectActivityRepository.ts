import prisma from '@client/providers/PrismaClient'
import { injectable } from 'inversify'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { UUID } from '@domain/shared/UUID'
import ProspectActivityRepository from '@domain/prospect/ProspectActivityRepository'
import { ProspectActivityEntity } from '@domain/prospect/ProspectActivityEntity'
import { ProspectActivityFactory } from '@domain/prospect/ProspectActivityFactory'

@injectable()
export class PrismaProspectActivityRepository implements ProspectActivityRepository {
  async create(prospectActivity: ProspectActivityEntity): Promise<ProspectActivityEntity[]> {
    await prisma.prospectActivity.create({
      data: {
        ...prospectActivity.toDTO(),
        prospectActivityType: undefined,
        createdByUser: undefined,
        prospect: undefined,
        prospectStatus: undefined,
      },
    })

    return this.getByProspect(prospectActivity.getProspectId())
  }

  async getByProspect(prospectId: UUID): Promise<ProspectActivityEntity[]> {
    const activity = await prisma.prospectActivity.findMany({
      where: {
        prospectId: prospectId.toDTO(),
      },
      include: {
        prospectActivityType: true,
        createdByUser: true,
        prospectStatus: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return activity.map((t) => ProspectActivityFactory.fromDTO(convertPrismaToDTO<ProspectActivityEntity>(t)))
  }
}
