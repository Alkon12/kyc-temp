import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { CreateKycUseCase, CreateKycVerificationDto } from '@/application/use-cases/CreateKycUseCase'
import { ValidationError } from '@domain/error/ValidationError'
import AbstractVerificationLinkService from '@domain/verification-link/VerificationLinkService'
import { UUID } from '@domain/shared/UUID'
import { StringValue } from '@domain/shared/StringValue'
import { randomUUID } from 'crypto'
import AbstractCompanyService from '@domain/company/CompanyService'
import { CompanyId } from '@domain/company/models/CompanyId'
import { NotFoundError } from '@domain/error'

@injectable()
export class KycController {
  constructor(
    @inject(DI.CreateKycUseCase) private createKycUseCase: CreateKycUseCase,
    @inject(DI.VerificationLinkService) private verificationLinkService: AbstractVerificationLinkService,
    @inject(DI.CompanyService) private companyService: AbstractCompanyService
  ) {}

  async createVerification(req: Request, res: Response) {
    try {
      const { 
        externalReferenceId, 
        verificationType, 
        priority, 
        riskLevel, 
        notes, 
        personInfo,
        assignToUserId,
        requiresDocumentSigning,
        documentSigningInfo
      } = req.body as CreateKycVerificationDto

      // Extraer el companyId del header en lugar del body
      const companyId = req.headers['x-company-id'] as string
      
      // Validar que se haya establecido el companyId en el header por el middleware
      if (!companyId) {
        return res.status(400).json({ error: 'Company ID is missing. Make sure your API Key is valid.' })
      }

      if (!verificationType) {
        return res.status(400).json({ error: 'verificationType is required' })
      }

      const result = await this.createKycUseCase.execute({
        companyId,
        externalReferenceId,
        verificationType,
        priority,
        riskLevel,
        notes,
        personInfo,
        assignToUserId,
        requiresDocumentSigning,
        documentSigningInfo
      })

      const resultDTO = result.toDTO()
      
      // Crear un enlace de verificación que expire en 24 horas
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      
      console.log('Creating verification link with verification ID:', resultDTO.id);
      
      const verificationLink = await this.verificationLinkService.create({
        verificationId: new UUID(resultDTO.id),
        expiresAt: new StringValue(expiresAt.toISOString())
      })
      
      const verificationLinkDTO = verificationLink.toDTO()
      
      // Log para verificar que el ID se pasó correctamente
      console.log('Created verification link:', {
        linkId: verificationLinkDTO.id,
        verificationId: verificationLinkDTO.verificationId,
        originalVerificationId: resultDTO.id
      });
      
      // Obtener la URL base de la aplicación
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kyc-temp.vercel.app'
      
      // Usar el token del enlace creado
      const facetecUrl = `${baseUrl}/facetec?token=${verificationLinkDTO.token}`

      return res.status(201).json({
        success: true,
        data: {
          id: resultDTO.id,
          token: verificationLinkDTO.token,
          expiresAt: verificationLinkDTO.expiresAt,
          facetecUrl,
          // Para depuración
          verificationId: verificationLinkDTO.verificationId
        }
      })
    } catch (error) {
      console.error('Error creating KYC verification:', error)
      
      if (error instanceof ValidationError) {
        return res.status(400).json({
          success: false,
          error: error.message
        })
      }

      return res.status(500).json({
        success: false,
        error: 'An error occurred while creating the KYC verification'
      })
    }
  }

  async generateApiKey(req: Request, res: Response): Promise<Response> {
    try {
      const { companyId } = req.body

      if (!companyId) {
        return res.status(400).json({
          success: false,
          error: 'Company ID is required'
        })
      }

      // Generar una API Key aleatoria con prefijo
      const apiKey = `kyc_${randomUUID().replace(/-/g, '')}`

      // Actualizar la compañía con la nueva API Key
      const company = await this.companyService.updateApiKey(new CompanyId(companyId), new StringValue(apiKey))

      return res.status(200).json({
        success: true,
        data: {
          companyId: company.getId().toDTO(),
          companyName: company.getCompanyName().toDTO(),
          apiKey: company.getApiKey().toDTO()
        }
      })
    } catch (error) {
      console.error('Error generating API Key:', error)
      
      if (error instanceof NotFoundError) {
        return res.status(404).json({
          success: false,
          error: error.message
        })
      }
      
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      })
    }
  }
}