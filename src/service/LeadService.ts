import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import { LeadEntity, LeadEntityProps } from '@domain/lead/LeadEntity'
import { LeadFactory } from '@domain/lead/LeadFactory'
import type LeadRepository from '@domain/lead/LeadRepository'
import { BooleanValue } from '@domain/shared/BooleanValue'
import AbstractLeadService from '@domain/lead/LeadService'
import { UUID } from '@domain/shared/UUID'
import { CreateLeadArgs } from '@domain/lead/interfaces/CreateLeadArgs'
import { StringValue } from '@domain/shared/StringValue'
import { PhoneNumber } from '@domain/shared/PhoneNumber'
import { Email } from '@domain/shared/Email'
import { LeadStatus } from '@domain/lead/LeadStatus'
import { LeadOverviewCountRefineResponse, LeadOverviewResponse } from '@domain/lead/interfaces/LeadOverviewResponse'
import { OverviewCount } from '@domain/shared/OverviewCount'
import { type UberService } from '@/application/service/UberService'
import { DateTimeValue } from '@domain/shared/DateTime'

@injectable()
export class LeadService implements AbstractLeadService {
  @inject(DI.LeadRepository) private readonly _leadRepository!: LeadRepository
  @inject(DI.UberService) private readonly _uberService!: UberService

  async create(props: DTO<CreateLeadArgs>): Promise<BooleanValue> {
    const prepareLead = LeadFactory.create({
      email: props.email ? new Email(props.email) : undefined,
      firstName: props.firstName ? new StringValue(props.firstName) : undefined,
      lastName: props.lastName ? new StringValue(props.lastName) : undefined,
      phoneNumber: props.phoneNumber ? new PhoneNumber(props.phoneNumber) : undefined,
      contactype: props.contactype ? new StringValue(props.contactype) : undefined,
      status: LeadStatus.ARRIVED,
      supportUserId: props.supportUserId ? new UUID(props.supportUserId) : undefined,
      visitAppointmentAt: props.visitAppointmentAt ? new DateTimeValue(props.visitAppointmentAt) : undefined,
    })

    let hasUberAccount = false

    const leadEmail = prepareLead.getEmail()
    const leadPhoneNumber = prepareLead.getPhoneNumber()

    if (leadEmail) {
      const foundEmailInUber = await this._uberService.searchDriverByEmail(leadEmail.toDTO())
      if (foundEmailInUber) {
        hasUberAccount = true
      }
    }

    if (leadPhoneNumber && !hasUberAccount) {
      const phone = leadPhoneNumber.getCountryCodeNumber()

      const foundPhoneNumberInUber = await this._uberService.searchDriverByPhoneNumber(
        leadPhoneNumber.toDTO(),
        leadPhoneNumber.toDTO(),
      )
      if (foundPhoneNumberInUber) {
        hasUberAccount = true
      }
    }

    prepareLead.setHasUberAccount(hasUberAccount)

    return this._leadRepository.create(prepareLead)
  }

  async update(props: DTO<LeadEntityProps>): Promise<BooleanValue> {
    const lead = LeadFactory.fromDTO(props)
    return this._leadRepository.update(lead)
  }

  async getAll(): Promise<LeadEntity[]> {
    return this._leadRepository.getAll()
  }

  async getActive(): Promise<LeadEntity[]> {
    const leads = await this._leadRepository.getAll()

    return leads.filter((l) => !l.wasDismissed() && !l.wasConverted())
  }

  async getById(leadId: UUID): Promise<LeadEntity | null> {
    return this._leadRepository.getById(leadId)
  }

  async overview(): Promise<LeadOverviewResponse> {
    // TODO remove leads with users
    const leads = await this._leadRepository.getAll()

    return {
      withUberAccount: this._getCountRefine(leads.filter((l) => l.hasUberAccount())),
      withoutUberAccount: this._getCountRefine(leads.filter((l) => !l.hasUberAccount())),
    }
  }

  _getCountRefine = (leads: LeadEntity[]): LeadOverviewCountRefineResponse => {
    const arrived = leads.filter((l) => l.isArrived()).length
    const beingManaged = leads.filter((l) => l.isBeingManaged()).length
    const dismissed = leads.filter((l) => l.wasDismissed()).length
    const converted = leads.filter((l) => l.wasConverted()).length

    return {
      arrived: new OverviewCount(arrived).toDTO(),
      beingManaged: new OverviewCount(beingManaged).toDTO(),
      dismissed: new OverviewCount(dismissed).toDTO(),
      converted: new OverviewCount(converted).toDTO(),
    }
  }
}
