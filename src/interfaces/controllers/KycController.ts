import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { CreateKycUseCase, CreateKycVerificationDto } from '@/application/use-cases/CreateKycUseCase'
import { ValidationError } from '@domain/error/ValidationError'

@injectable()
export class KycController {
  constructor(
    @inject(DI.CreateKycUseCase) private createKycUseCase: CreateKycUseCase
  ) {}

  async createVerification(req: Request, res: Response) {
    try {
      const { 
        companyId, 
        externalReferenceId, 
        verificationType, 
        priority, 
        riskLevel, 
        notes, 
        personInfo,
        assignToUserId
      } = req.body as CreateKycVerificationDto

      // Validación básica
      if (!companyId) {
        return res.status(400).json({ error: 'companyId is required' })
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
        assignToUserId
      })

      const resultDTO = result.toDTO()
      
      // Obtener la URL base de la aplicación
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const facetecUrl = `${baseUrl}/facetec?id=${resultDTO.id}`

      return res.status(201).json({
        success: true,
        data: {
          facetecUrl
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
}