import prisma from '@client/providers/PrismaClient'
import LeadRepository from '@/domain/lead/LeadRepository'
import { LeadEntity } from '@/domain/lead/LeadEntity'
import { BooleanValue } from '@/domain/shared/BooleanValue'
import { injectable } from 'inversify'
import { LeadFactory } from '@domain/lead/LeadFactory'
import { convertPrismaToDTO } from '@/client/utils/nullToUndefined'
import { UUID } from '@domain/shared/UUID'
import { LeadStatus } from '@domain/lead/LeadStatus'

@injectable()
export class PrismaLeadRepository implements LeadRepository {
  async create(lead: LeadEntity): Promise<BooleanValue> {
    console.log('Lead Create', lead)

    // To convert string to enum:
    // - https://stackoverflow.com/questions/17380845/how-do-i-convert-a-string-to-enum-in-typescript
    // const leadStatus : LeadStatus = <LeadStatus><unknown>lead.props.status.toDTO();
    try {
      await prisma.lead.create({
        data: {
          ...lead.toDTO(),
          location: undefined,
          supportUser: undefined,
          status: LeadStatus.ARRIVED.toDTO(),
        },
      })
      return new BooleanValue(true)
    } catch (e) {
      console.error(e)
      return new BooleanValue(false)
    }
  }

  async update(data: LeadEntity): Promise<BooleanValue> {
    try {
      const dto = { ...data.toDTO() }
      const id = dto.id

      await prisma.lead.update({
        where: { id },
        data: { ...dto, location: undefined, supportUser: undefined },
      })
      return new BooleanValue(true)
    } catch (e) {
      console.error(e)
      return new BooleanValue(false)
    }
  }

  async getAll(): Promise<LeadEntity[]> {
    const leads = await prisma.lead.findMany({
      include: {
        location: true,
        supportUser: true,
      },
    })

    return leads.map((lead) => LeadFactory.fromDTO(convertPrismaToDTO<LeadEntity>(lead)))
  }

  async getById(leadId: UUID): Promise<LeadEntity | null> {
    const lead = await prisma.lead.findUnique({
      where: {
        id: leadId.toDTO(),
      },
      include: {
        location: true,
      },
    })

    if (!lead) {
      return null
    }

    return LeadFactory.fromDTO(convertPrismaToDTO<LeadEntity>(lead))
  }
}
