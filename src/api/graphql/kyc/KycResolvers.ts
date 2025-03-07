import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { KycService } from '@service/KycService'
import {
  KycIdentificationCardMatch,
  KycIdentificationCardMatchParsed,
  KycOverview,
  MutationSetInactivityStatementArgs,
  MutationSetKycAddressArgs,
  QueryKycIdentificationCardMatchArgs,
} from '../app.schema.gen'
import { ApiContext } from '@api/shared/Api'
import { AddressEntity } from '@domain/address/AddressEntity'
import { AddressFactory } from '@domain/address/AddressFactory'
import { DTO } from '@domain/kernel/DTO'
import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'
import AbstractKycService from '@domain/kyc/KycService'
import { ContentService } from '@/application/service/ContentService'
import AbstractApplicationService from '@domain/application/ApplicationService'
import { NotFoundError } from '@domain/error'
import { ParseService } from '@/application/service/ParseService'

@injectable()
export class KycResolvers {
  build() {
    return {
      Query: {
        kycOverview: this.kycOverview,
        kycIdentificationCardMatch: this.kycIdentificationCardMatch,
      },
      Mutation: {
        setKycAddress: this.setKycAddress,
        setInactivityStatement: this.setInactivityStatement,
      },
    }
  }

  kycOverview = async (): Promise<KycOverview> => {
    const kycService = container.get<KycService>(DI.KycService)

    return kycService.overview()
  }

  kycIdentificationCardMatch = async (
    _: unknown,
    { applicationId }: QueryKycIdentificationCardMatchArgs,
  ): Promise<KycIdentificationCardMatch> => {
    const applicationService = container.get<AbstractApplicationService>(DI.ApplicationService)
    const application = await applicationService.getById(new UUID(applicationId))
    if (!application) {
      throw new NotFoundError('Application not found')
    }

    const identificationCard = application.getIdentificationCard()
    if (!identificationCard) {
      throw new NotFoundError('Application hasnt an Id Card')
    }

    const contentService = container.get<ContentService>(DI.ContentService)
    const documentInfo = await contentService.info(identificationCard)
    const data = documentInfo.content

    let parsed: KycIdentificationCardMatchParsed = {}
    if (data) {
      const parseService = container.get<ParseService>(DI.ParseService)

      parsed = await parseService.parseIdentificationCardFromText(new StringValue(data))
    }

    return {
      verdict: 'TMP',
      parsed,
    }
  }

  setKycAddress = async (
    _parent: unknown,
    { taskId, input }: MutationSetKycAddressArgs,
    context: ApiContext,
  ): Promise<DTO<AddressEntity> | null> => {
    const kycService = container.get<AbstractKycService>(DI.KycService)

    const prepareAddress = AddressFactory.create({
      street: new StringValue(input.street),
      extNumber: new StringValue(input.extNumber),
      intNumber: new StringValue(input.intNumber),
      zipCode: new StringValue(input.zipCode),
      district: new StringValue(input.district),
      city: new StringValue(input.city),
      state: new StringValue(input.state),
      country: new StringValue(input.country),
      latitude: new StringValue(input.latitude),
      longitude: new StringValue(input.longitude),
      real_time_latitude: new StringValue(input.real_time_latitude || ''),
      real_time_longitude: new StringValue(input.real_time_longitude || ''),
    })

    const address = await kycService.setKycAddress(context.userId, new UUID(taskId), prepareAddress)

    return address.toDTO()
  }

  setInactivityStatement = async (
    _parent: unknown,
    { taskId, input }: MutationSetInactivityStatementArgs,
    context: ApiContext,
  ): Promise<Boolean> => {
    const kycService = container.get<AbstractKycService>(DI.KycService)

    return kycService.setInactivityStatement(context.userId, new UUID(taskId), new StringValue(input.reason))
  }
}
