import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import {
  Content,
  ContentMetadata,
  MutationCreateApplicationArgs,
  MutationRevokeApplicationArgs,
  QueryApplicationByIdArgs,
} from '../app.schema.gen'
import { ApplicationEntity } from '@domain/application/ApplicationEntity'
import { CreateApplicationResponse } from '@domain/application/interfaces/CreateApplicationResponse'
import { ApplicationFactory } from '@domain/application/ApplicationFactory'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { GraphQLResolveInfo } from 'graphql'
import { getContentUrl } from '@api/shared/contentUrl'
import { ContentKey } from '@domain/content/ContentKey'
import { UUID } from '@domain/shared/UUID'
import AbstractApplicationService from '@domain/application/ApplicationService'
import { ContractEntity } from '@domain/contract/ContractEntity'
import AbstractContractService from '@domain/contract/AbstractContractService'

@injectable()
export class ApplicationResolvers {
  build() {
    return {
      Query: {
        applications: this.getAll,
        applicationById: this.applicationById,
        activeApplications: this.activeApplications,
      },
      Mutation: {
        createApplication: this.createApplication,
        revokeApplication: this.revokeApplication,
      },
      Application: {
        hasDriverEngaged: this.hasDriverEngaged,
        hasKycFinished: this.hasKycFinished,
        identificationCard: this.resolveContent,
        identificationCardReverse: this.resolveContent,
        selfiePicture: this.resolveContent,
        driversLicense: this.resolveContent,
        driversLicenseReverse: this.resolveContent,
        incomeStatement: this.resolveContent,
        inactivityStatement: this.resolveContent,
        taxIdentification: this.resolveContent,
        addressProof: this.resolveContent,
        contract: this.contractSmartIt,
      },
      Content: {
        // TODO move outside
        metadata: this.resolveContentMetadata,
      },
    }
  }

  activeApplications = async (_parent: unknown): Promise<DTO<ApplicationEntity[]>> => {
    const applicationService = container.get<AbstractApplicationService>(DI.ApplicationService)
    const applications = await applicationService.getActive()

    return applications.map((a) => a.toDTO())
  }

  createApplication = async (
    _parent: unknown,
    { offerId }: MutationCreateApplicationArgs,
  ): Promise<DTO<CreateApplicationResponse>> => {
    const applicationService = container.get<AbstractApplicationService>(DI.ApplicationService)

    const createdResponse = await applicationService.create({
      offerId,
    })

    return {
      application: createdResponse.application.toDTO(),
      flowStatus: createdResponse.flowStatus.toDTO(),
    }
  }

  hasDriverEngaged = async (parent: DTO<ApplicationEntity>, _: unknown): Promise<DTO<BooleanValue>> => {
    const application = ApplicationFactory.fromDTO(parent)

    return application.hasDriverEngaged()
  }

  hasKycFinished = async (parent: DTO<ApplicationEntity>, _: unknown): Promise<DTO<BooleanValue>> => {
    const application = ApplicationFactory.fromDTO(parent)

    return application.hasKycFinished()
  }

  getAll = async (_parent: unknown): Promise<DTO<ApplicationEntity[]>> => {
    const applicationService = container.get<AbstractApplicationService>(DI.ApplicationService)
    const applications = await applicationService.getAll()

    return applications.map((a) => a.toDTO())
  }

  applicationById = async (
    _parent: unknown,
    { applicationId }: QueryApplicationByIdArgs,
  ): Promise<DTO<ApplicationEntity>> => {
    const applicationService = container.get<AbstractApplicationService>(DI.ApplicationService)
    const application = await applicationService.getById(new UUID(applicationId))

    return application.toDTO()
  }

  revokeApplication = async (
    _parent: unknown,
    { applicationId }: MutationRevokeApplicationArgs,
  ): Promise<DTO<BooleanValue>> => {
    const applicationService = container.get<AbstractApplicationService>(DI.ApplicationService)
    await applicationService.revoke(new UUID(applicationId))

    return true
  }

  resolveContent = async (
    parent: DTO<ApplicationEntity>,
    _args: unknown,
    _context: unknown,
    info: GraphQLResolveInfo,
  ): Promise<DTO<Content>> => {
    const parentEl = parent as Record<string, unknown>
    const pathKeyString = parentEl[info.path.key] as string
    if (!pathKeyString) {
      return {}
    }
    const contentKey = new ContentKey(pathKeyString)

    return {
      key: contentKey.toDTO(),
      viewUrl: getContentUrl(contentKey, 'OPEN'),
      downloadUrl: getContentUrl(contentKey, 'DOWNLOAD'),
      thumbnailUrl: getContentUrl(contentKey, 'THUMBNAIL'),
      previewUrl: getContentUrl(contentKey, 'PREVIEW'),
    }
  }

  resolveContentMetadata = async (parent: DTO<Content>): Promise<DTO<ContentMetadata>> => {
    return {
      size: 0,
      originalFilename: 'TMP',
    }
  }

  contractSmartIt = async (parent: DTO<ApplicationEntity>, _: unknown): Promise<DTO<ContractEntity> | null> => {
    const contractService = container.get<AbstractContractService>(DI.ContractService)

    if (!parent.contractId) return null

    const contractSmartIt = await contractService.getById(parseInt(parent.contractId))

    return contractSmartIt ? contractSmartIt.toDTO() : null
  }
}
