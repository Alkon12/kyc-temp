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
  MutationInvalidateVerificationLinkArgs,
  MutationRecordVerificationLinkAccessArgs,
  MutationUpdateVerificationLinkStatusArgs
} from '../app.schema.gen'
import AbstractKycVerificationService from '@domain/kycVerification/KycVerificationService'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'

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
        recordVerificationLinkAccess: this.recordVerificationLinkAccess,
        updateVerificationLinkStatus: this.updateVerificationLinkStatus,
      },
      VerificationLink: {
        kycVerification: this.resolveKycVerification,
      }
    }
  }

  // Resolver específico para el campo kycVerification
  resolveKycVerification = async (parent: any): Promise<any> => {
    console.log('Resolving kycVerification for verificationId:', parent.verificationId);
    
    if (!parent.verificationId) {
      console.error('No verificationId found in parent:', parent);
      return null;
    }
    
    try {
      const kycVerificationService = container.get<AbstractKycVerificationService>(DI.KycVerificationService);
      const verification = await kycVerificationService.getById(new KycVerificationId(parent.verificationId));
      
      console.log('Resolved kycVerification:', verification ? 'found' : 'not found');
      
      return verification ? verification.toDTO() : null;
    } catch (error) {
      console.error('Error resolving kycVerification:', error);
      return null;
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
    
    // Verificar expiración automáticamente
    if (verificationLink.isExpired()) {
      console.log(`El enlace con token ${token.substring(0, 8)}... ha expirado. Actualizando estado.`)
      await verificationLinkService.save(verificationLink)
    }
    
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

  recordVerificationLinkAccess = async (_parent: unknown, { token }: MutationRecordVerificationLinkAccessArgs): Promise<DTO<VerificationLinkEntity>> => {
    const verificationLinkService = container.get<AbstractVerificationLinkService>(DI.VerificationLinkService)
    
    try {
      // Obtener el enlace por token
      const verificationLink = await verificationLinkService.getByToken(new StringValue(token))
      
      // Verificar expiración primero
      if (verificationLink.isExpired()) {
        console.log(`El enlace con token ${token.substring(0, 8)}... ha expirado al registrar acceso.`)
        await verificationLinkService.save(verificationLink)
        // Continuamos registrando el acceso aunque haya expirado, para auditoría
      }
      
      // Incrementar el contador de accesos
      verificationLink.incrementAccessCount()
      
      // Guardar los cambios
      const updatedLink = await verificationLinkService.save(verificationLink)
      
      return updatedLink.toDTO()
    } catch (error) {
      console.error('Error al registrar acceso:', error)
      throw error
    }
  }

  updateVerificationLinkStatus = async (_parent: unknown, { token, status }: MutationUpdateVerificationLinkStatusArgs): Promise<DTO<VerificationLinkEntity>> => {
    const verificationLinkService = container.get<AbstractVerificationLinkService>(DI.VerificationLinkService)
    
    try {
      // Obtener el enlace por token
      const verificationLink = await verificationLinkService.getByToken(new StringValue(token))
      
      // Verificar expiración primero
      if (verificationLink.isExpired()) {
        console.log(`El enlace con token ${token.substring(0, 8)}... ha expirado. No se puede actualizar estado.`)
        await verificationLinkService.save(verificationLink)
        throw new Error('El enlace ha expirado y no se puede actualizar su estado')
      }
      
      // Actualizar el estado
      verificationLink.updateStatus(status)
      
      // Guardar los cambios
      const updatedLink = await verificationLinkService.save(verificationLink)
      
      console.log(`Estado del enlace actualizado a: ${status}`)
      return updatedLink.toDTO()
    } catch (error) {
      console.error('Error al actualizar estado:', error)
      throw error
    }
  }
} 