import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import { VerificationLinkId } from '@domain/verification-link/models/VerificationLinkId'
import { VerificationLinkEntity } from '@domain/verification-link/models/VerificationLinkEntity'
import AbstractVerificationLinkService from '@domain/verification-link/VerificationLinkService'
import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'
import { 
  QueryGetVerificationLinkByIdArgs,
  QueryGetVerificationLinkByTokenArgs,
  QueryGetVerificationLinksByVerificationIdArgs,
  MutationCreateVerificationLinkArgs,
  MutationValidateVerificationLinkArgs,
  MutationInvalidateVerificationLinkArgs
} from '../app.schema.gen'

@injectable()
export class VerificationLinkResolvers {
  build() {
    return {
      Query: {
        getVerificationLinkById: this.getVerificationLinkById,
        getVerificationLinkByToken: this.getVerificationLinkByToken,
        getVerificationLinksByVerificationId: this.getVerificationLinksByVerificationId,
      },
      Mutation: {
        createVerificationLink: this.createVerificationLink,
        validateVerificationLink: this.validateVerificationLink,
        invalidateVerificationLink: this.invalidateVerificationLink,
      },
    }
  }

  getVerificationLinkById = async (_parent: unknown, { verificationLinkId }: QueryGetVerificationLinkByIdArgs): Promise<DTO<VerificationLinkEntity>> => {
    const verificationLinkService = container.get<AbstractVerificationLinkService>(DI.VerificationLinkService)

    const verificationLink = await verificationLinkService.getById(new VerificationLinkId(verificationLinkId))

    return verificationLink.toDTO()
  }

  getVerificationLinkByToken = async (_parent: unknown, { token }: QueryGetVerificationLinkByTokenArgs): Promise<DTO<VerificationLinkEntity>> => {
    const verificationLinkService = container.get<AbstractVerificationLinkService>(DI.VerificationLinkService)

    const verificationLink = await verificationLinkService.getByToken(new StringValue(token))

    return verificationLink.toDTO()
  }

  getVerificationLinksByVerificationId = async (_parent: unknown, { verificationId }: QueryGetVerificationLinksByVerificationIdArgs): Promise<DTO<VerificationLinkEntity>[]> => {
    const verificationLinkService = container.get<AbstractVerificationLinkService>(DI.VerificationLinkService)

    const verificationLinks = await verificationLinkService.getByVerificationId(new UUID(verificationId))

    return verificationLinks.map(link => link.toDTO())
  }

  createVerificationLink = async (_parent: unknown, { input }: MutationCreateVerificationLinkArgs): Promise<DTO<VerificationLinkEntity>> => {
    const verificationLinkService = container.get<AbstractVerificationLinkService>(DI.VerificationLinkService)

    // Prepare the args with optional fields properly handled
    const createArgs = {
      verificationId: new UUID(input.verificationId),
    } as any // Using as any temporarily to avoid TypeScript errors during construction
    
    // Add optional fields only if they exist
    if (input.token) {
      createArgs.token = new StringValue(input.token)
    }
    
    if (input.expiresAt) {
      createArgs.expiresAt = new StringValue(input.expiresAt)
    }

    const verificationLink = await verificationLinkService.create(createArgs)

    return verificationLink.toDTO()
  }

  validateVerificationLink = async (_parent: unknown, { token }: MutationValidateVerificationLinkArgs): Promise<boolean> => {
    const verificationLinkService = container.get<AbstractVerificationLinkService>(DI.VerificationLinkService)

    return verificationLinkService.validateToken(new StringValue(token))
  }

  invalidateVerificationLink = async (_parent: unknown, { token }: MutationInvalidateVerificationLinkArgs): Promise<boolean> => {
    const verificationLinkService = container.get<AbstractVerificationLinkService>(DI.VerificationLinkService)

    return verificationLinkService.invalidateToken(new StringValue(token))
  }
} 