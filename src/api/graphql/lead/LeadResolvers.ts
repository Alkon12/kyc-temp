import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import LeadService from '@domain/lead/LeadService'
import { DI } from '@infrastructure'
import { LeadEntity } from '@domain/lead/LeadEntity'
import { DTO } from '@domain/kernel/DTO'
import { QueryLeadByIdArgs, MutationSetLeadStatusArgs, MutationCreateLeadArgs, LeadOverview } from '../app.schema.gen'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { UUID } from '@domain/shared/UUID'
import { first } from 'node_modules/cheerio/dist/esm/api/traversing'
import { last } from 'lodash'
import { ApiContext } from '@api/shared/Api'

@injectable()
export class LeadResolvers {
  build() {
    return {
      Query: {
        leads: this.leads,
        activeLeads: this.activeLeads,
        leadById: this.leadById,
        leadOverview: this.leadOverview,
      },
      Mutation: {
        createLead: this.createLead,
        setLeadStatus: this.setLeadStatus,
      },
    }
  }

  leads = async (_parent: unknown): Promise<DTO<LeadEntity[]>> => {
    const leadService = container.get<LeadService>(DI.LeadService)
    const leads = await leadService.getAll()

    return leads.map((l) => l.toDTO())
  }

  activeLeads = async (_parent: unknown): Promise<DTO<LeadEntity[]>> => {
    const leadService = container.get<LeadService>(DI.LeadService)
    const leads = await leadService.getActive()

    return leads.map((l) => l.toDTO())
  }

  leadById = async (_parent: unknown, { leadId }: QueryLeadByIdArgs): Promise<DTO<LeadEntity | null>> => {
    const leadService = container.get<LeadService>(DI.LeadService)
    const lead = await leadService.getById(new UUID(leadId))
    if (!lead) {
      return null
    }

    return lead.toDTO()
  }

  createLead = async (
    _parent: unknown,
    { input }: MutationCreateLeadArgs,
    context: ApiContext,
  ): Promise<DTO<BooleanValue>> => {
    // const country = await getClientCountry(request)
    // const ua = userAgent(request);
    const leadProps = {
      phoneNumber: input.phoneNumber,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      contactype: input.contactype,
      supportUserId: context.userId ? context.userId.toDTO() : undefined,
      visitAppointmentAt: input.visitAppointmentAt
    }
    const leadService = container.get<LeadService>(DI.LeadService)

    await leadService.create(leadProps)

    return true
  }

  setLeadStatus = async (_parent: unknown, { id, status }: MutationSetLeadStatusArgs): Promise<DTO<BooleanValue>> => {
    const leadStatusProps = {
      id,
      status,
    }
    const leadService = container.get<LeadService>(DI.LeadService)
    const lead = await leadService.update(leadStatusProps)
    return lead.toDTO()
  }

  leadOverview = async (): Promise<LeadOverview> => {
    const leadService = container.get<LeadService>(DI.LeadService)

    const leadOverview = await leadService.overview()

    return leadOverview
  }
}
