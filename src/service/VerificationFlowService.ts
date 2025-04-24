import { injectable, inject } from 'inversify';
import { DI } from '@infrastructure';
import type { LoggingService } from '@/application/service/LoggingService';
import { LoggingModule } from '@/application/service/LoggingService';
import type ValidationService from '@domain/integration/ValidationService';
import { ValidationError } from '@domain/integration/ValidationError';
import { KycVerificationType } from '@domain/kycVerification/models/KycVerificationType';
import { VerificationFlow, VerificationFlowFactory } from '@domain/kycVerification/VerificationFlow';
import type { KycVerificationService } from './KycVerificationService';
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId';
import { DateTimeValue } from '@domain/shared/DateTime';
import { StringValue } from '@domain/shared/StringValue';

@injectable()
export class VerificationFlowService {
  constructor(
    @inject(DI.ValidationService) private validationService: ValidationService,
    @inject(DI.LoggingService) private logger: LoggingService,
    @inject(DI.KycVerificationService) private kycVerificationService: KycVerificationService
  ) {}

  /**
   * Gets the verification flow for a specific verification ID
   */
  async getFlowForVerification(verificationId: string): Promise<VerificationFlow> {
    try {
      // Get the verification from the database
      const verification = await this.kycVerificationService.getById(new KycVerificationId(verificationId));
      
      // Extract the verification type
      const verificationType = verification.getVerificationType().toString();
      
      // Create the appropriate flow
      return VerificationFlowFactory.createFlow(verificationType);
    } catch (error) {
      this.logger.error(LoggingModule.GENERAL, 'Error getting verification flow', {
        verificationId,
        error: (error as Error).message
      });
      // Default to bronze flow if something goes wrong
      return VerificationFlowFactory.createFlow('bronze');
    }
  }

  /**
   * Determines if the contact form should be shown based on verification type
   */
  async shouldShowContactForm(verificationId: string): Promise<boolean> {
    const flow = await this.getFlowForVerification(verificationId);
    return flow.isContactFormRequired();
  }

  /**
   * Handle tier-specific validations when FaceTec scan is completed
   */
  async processFaceTecCompletion(verificationId: string, faceTecSessionId: string, documentImages: string[]): Promise<any> {
    try {
      const flow = await this.getFlowForVerification(verificationId);
      const verification = await this.kycVerificationService.getById(new KycVerificationId(verificationId));
      const results: any = { success: true, verificationId, timestamps: [] };
      
      this.logger.info('Procesando finalización FaceTec', {
        verificationId,
        verificationType: flow.getName(),
        requiresTimestamp: flow.isTimestampSealingRequired(),
        documentImagesCount: documentImages?.length || 0
      });
      
      // Apply timestamp sealing if required and we have images
      if (flow.isTimestampSealingRequired() && documentImages && documentImages.length > 0) {
        try {
          results.timestamps = await this.applyTimestamps(documentImages);
        } catch (timestampError) {
          this.logger.error(LoggingModule.GENERAL, 'Error al aplicar sellos de tiempo', {
            error: (timestampError as Error).message
          });
          // No fallamos todo el proceso, continuamos con lo que tengamos
          results.timestampError = (timestampError as Error).message;
        }
      }
      
      // Add notes about the verification flow used
      try {
        const now = new Date();
        const notes = new StringValue(`FaceTec verificación completada en ${now.toISOString()}. Tipo de verificación: ${flow.getName()}`);
        await this.kycVerificationService.updateStatus(
          verification.getId(),
          verification.getStatus(), // Maintain current status
          notes
        );
      } catch (notesError) {
        this.logger.error(LoggingModule.GENERAL, 'Error al actualizar notas', {
          error: (notesError as Error).message
        });
        // No fallamos todo el proceso por un error en las notas
      }
      
      return results;
    } catch (error) {
      this.logger.error(LoggingModule.GENERAL, 'Error processing FaceTec completion', {
        verificationId,
        error: (error as Error).message
      });
      
      throw new Error(`Failed to process FaceTec completion: ${(error as Error).message}`);
    }
  }

  /**
   * Apply timestamps to document images
   */
  private async applyTimestamps(images: string[]): Promise<any[]> {
    const results: {
      success: boolean;
      digestion?: string;
      timestamp?: string;
      date?: string;
      error?: string;
    }[] = [];
    
    if (!images || images.length === 0) {
      this.logger.warn(LoggingModule.GENERAL, 'No se proporcionaron imágenes para sellar');
      return results;
    }
    
    for (const image of images) {
      try {
        if (!image || typeof image !== 'string' || image.length === 0) {
          this.logger.warn(LoggingModule.GENERAL, 'Imagen inválida para sellado');
          continue; // Skip invalid images
        }
        
        // Create hash of the image to timestamp
        const imageHash = this.createDocumentHash(image);
        
        // Request timestamp seal
        const timestampResult = await this.validationService.requestSelloTiempo(imageHash);
        
        if (!timestampResult.success) {
          throw new Error(timestampResult.error || 'Failed to get timestamp');
        }
        
        results.push({
          success: true,
          digestion: imageHash,
          timestamp: timestampResult.data?.sello,
          date: timestampResult.data?.fechaSello
        });
      } catch (error) {
        this.logger.error(LoggingModule.GENERAL, 'Error applying timestamp to document', {
          error: (error as Error).message
        });
        
        results.push({
          success: false,
          error: (error as Error).message
        });
      }
    }
    
    return results;
  }

  /**
   * Create a hash digest of a document image for timestamping
   */
  private createDocumentHash(imageData: string): string {
    // In a real implementation, you would:
    // 1. Decode the Base64 image if needed
    // 2. Create a cryptographic hash (e.g., SHA-256)
    // 3. Encode the hash as Base64
    
    // This is a simplified example - replace with actual hash implementation
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');
    hash.update(imageData);
    return hash.digest('base64');
  }

  /**
   * Performs INE validation with lista nominal if required by the verification flow
   */
  async validateINE(verificationId: string, cic: string, identificador: string): Promise<boolean> {
    try {
      const flow = await this.getFlowForVerification(verificationId);
      
      // Only validate if required by the flow
      if (flow.isINEValidationRequired()) {
        return await this.validationService.validateListaNominal(cic, identificador)
          .then(result => result.success)
          .catch(() => false);
      }
      
      // If not required by the flow, consider it "validated"
      return true;
    } catch (error) {
      this.logger.error(LoggingModule.GENERAL, 'Error validating INE', {
        verificationId,
        error: (error as Error).message
      });
      
      return false;
    }
  }

  /**
   * Performs CURP validation if required by the verification flow
   */
  async validateCURP(verificationId: string, curp: string): Promise<boolean> {
    try {
      const flow = await this.getFlowForVerification(verificationId);
      
      // Only validate if required by the flow
      if (flow.isCURPValidationRequired()) {
        return await this.validationService.validateCurp(curp)
          .then(result => result.success)
          .catch(() => false);
      }
      
      // If not required by the flow, consider it "validated"
      return true;
    } catch (error) {
      this.logger.error(LoggingModule.GENERAL, 'Error validating CURP', {
        verificationId,
        error: (error as Error).message
      });
      
      return false;
    }
  }

  /**
   * Determines the next step after FaceTec verification based on the verification type
   */
  async getNextStepAfterFaceTec(verificationId: string): Promise<'complete' | 'contact'> {
    const flow = await this.getFlowForVerification(verificationId);
    return flow.getNextStepAfterFaceTec();
  }
} 