import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { FaceTecService } from '@domain/faceTec/FaceTecService'
import { KycVerificationService } from '@service/KycVerificationService'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { ValidationError } from '@domain/error/ValidationError'
import { KycVerificationStatus } from '@domain/kycVerification/models/KycVerificationStatus'

export interface CreateFaceTecSessionDto {
  verificationId: string
}

@injectable()
export class CreateFaceTecSessionUseCase {
  constructor(
    @inject(DI.FaceTecService) private faceTecService: FaceTecService,
    @inject(DI.KycVerificationService) private kycVerificationService: KycVerificationService
  ) {}

  async execute(dto: CreateFaceTecSessionDto) {
    if (!dto.verificationId) {
      throw new ValidationError('verificationId is required')
    }

    // Obtener la verificación KYC y validar que esté en estado pendiente
    const verificationId = new KycVerificationId(dto.verificationId)
    const verification = await this.kycVerificationService.getById(verificationId)
    
    if (verification.getStatus().toDTO() !== 'pending') {
      throw new ValidationError('Verification is not in pending status')
    }
    
    // Actualizar el estado de la verificación a 'in-progress'
    await this.kycVerificationService.updateStatus(
      verification.getId(),
      new KycVerificationStatus('in-progress')
    )
    
    // Crear la sesión de FaceTec
    const session = await this.faceTecService.createSession(dto.verificationId)
    
    return session
  }
}
