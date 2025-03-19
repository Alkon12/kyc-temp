import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { FaceTecService } from '@domain/faceTec/FaceTecService'
import { KycVerificationService } from '@service/KycVerificationService'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { KycVerificationStatus } from '@domain/kycVerification/models/KycVerificationStatus'
import { StringValue } from '@domain/shared/StringValue'
import { ValidationError } from '@domain/error/ValidationError'
import prisma from '@client/providers/PrismaClient'

export interface ProcessFaceTecResultsDto {
  sessionId: string
  verificationId: string
  faceScanData: any
}

@injectable()
export class ProcessFaceTecResultsUseCase {
  // Umbrales para aprobación automática (reducidos para pruebas)
  private readonly MATCH_LEVEL_THRESHOLD = 80.0
  private readonly LIVENESS_SCORE_THRESHOLD = 80.0  // Reducido para que sea igual al match level

  constructor(
    @inject(DI.FaceTecService) private faceTecService: FaceTecService,
    @inject(DI.KycVerificationService) private kycVerificationService: KycVerificationService
  ) {}

  async execute(dto: ProcessFaceTecResultsDto) {
    if (!dto.sessionId || !dto.verificationId || !dto.faceScanData) {
      throw new ValidationError('Missing required parameters')
    }
    
    // Asegurar que el verificationId es un string
    if (typeof dto.verificationId !== 'string') {
      throw new ValidationError(`verificationId debe ser un string, recibido: ${typeof dto.verificationId}`)
    }

    console.log('Procesando verificación ID:', dto.verificationId);
    console.log('Datos de faceScan recibidos:', dto.faceScanData);

    // Procesar los resultados del escaneo facial
    const results = await this.faceTecService.processResults(dto.sessionId, dto.faceScanData)
    
    // Guardar los resultados en la base de datos
    await prisma.facetecResult.create({
      data: {
        sessionId: dto.sessionId,
        verificationId: dto.verificationId,
        matchLevel: results.matchLevel,
        livenessScore: results.livenessScore,
        confidenceScore: results.confidenceScore,
        faceScanSecurityLevel: results.faceScanSecurityLevel,
        auditTrailImage: results.auditTrailImage,
        lowQualityAuditTrailImage: results.lowQualityAuditTrailImage,
        fullResponse: results.fullResponse,
        manualReviewRequired: results.matchLevel < this.MATCH_LEVEL_THRESHOLD || 
                              results.livenessScore < this.LIVENESS_SCORE_THRESHOLD,
        manualReviewReason: this.getManualReviewReason(results)
      }
    })
    
    try {
      // Crear ID de verificación
      const verificationId = new KycVerificationId(dto.verificationId);
      
      // Determinar el nuevo estado
      const newStatus = (results.matchLevel >= this.MATCH_LEVEL_THRESHOLD && 
                        results.livenessScore >= this.LIVENESS_SCORE_THRESHOLD)
                        ? 'approved'
                        : 'requires-review';
                        
      // Determinar la nota
      const note = (newStatus === 'approved')
                  ? `Aprobación automática: Match Level ${results.matchLevel}, Liveness Score ${results.livenessScore}`
                  : `Requiere revisión manual: Match Level ${results.matchLevel}, Liveness Score ${results.livenessScore}`;
      
      // Actualizar estado
      const verification = await this.kycVerificationService.getById(verificationId);
      verification.updateStatus(new KycVerificationStatus(newStatus));
      verification.updateNotes(new StringValue(note));
      
      // Guardar usando el repositorio directamente
      return await this.kycVerificationService.updateStatus(verificationId, new KycVerificationStatus(newStatus));
    } catch (error) {
      console.error('Error procesando verificación:', error);
      throw error;
    }
  }

  private getManualReviewReason(results: any): string {
    const reasons = []
    
    if (results.matchLevel < this.MATCH_LEVEL_THRESHOLD) {
      reasons.push(`Match level too low: ${results.matchLevel}`)
    }
    
    if (results.livenessScore < this.LIVENESS_SCORE_THRESHOLD) {
      reasons.push(`Liveness score too low: ${results.livenessScore}`)
    }
    
    return reasons.join(', ')
  }
}
