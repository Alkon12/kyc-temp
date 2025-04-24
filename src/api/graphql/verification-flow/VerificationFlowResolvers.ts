import { DI } from '@infrastructure'
import { injectable, inject } from 'inversify'
import { VerificationFlowService } from '@service/VerificationFlowService'
import { VerificationFlow } from '@domain/kycVerification/VerificationFlow'

@injectable()
export class VerificationFlowResolvers {
  constructor(
    @inject(DI.VerificationFlowService) private verificationFlowService: VerificationFlowService
  ) {}

  /**
   * Query Resolvers
   */
  async getNextStepAfterFaceTec(parent: any, { verificationId }: { verificationId: string }): Promise<string> {
    return this.verificationFlowService.getNextStepAfterFaceTec(verificationId);
  }

  async shouldShowContactForm(parent: any, { verificationId }: { verificationId: string }): Promise<boolean> {
    return this.verificationFlowService.shouldShowContactForm(verificationId);
  }

  async getVerificationFlow(parent: any, { verificationId }: { verificationId: string }): Promise<any> {
    const flow: VerificationFlow = await this.verificationFlowService.getFlowForVerification(verificationId);
    
    return {
      type: flow.getName(),
      isContactFormRequired: flow.isContactFormRequired(),
      isTimestampSealingRequired: flow.isTimestampSealingRequired(),
      isINEValidationRequired: flow.isINEValidationRequired(),
      isCURPValidationRequired: flow.isCURPValidationRequired(),
      nextStepAfterFaceTec: flow.getNextStepAfterFaceTec()
    };
  }

  /**
   * Mutation Resolvers
   */
  async processFaceTecCompletion(
    parent: any,
    { verificationId, faceTecSessionId, documentImages }: { verificationId: string; faceTecSessionId: string; documentImages: string[] }
  ): Promise<any> {
    try {
      // Validación de entrada
      if (!verificationId) {
        return {
          success: false,
          verificationId: '',
          timestamps: null,
          error: 'ID de verificación no proporcionado'
        };
      }

      // Validar y sanitizar imágenes si están presentes
      const validImages = Array.isArray(documentImages) 
        ? documentImages.filter(img => typeof img === 'string' && img.length > 0)
        : [];
      
      console.log(`[VerificationFlowResolvers] Procesando FaceTec: verificationId=${verificationId}, imágenes=${validImages.length}`);
      
      // Obtener flujo para verificar si realmente necesitamos procesar imágenes
      const flow = await this.verificationFlowService.getFlowForVerification(verificationId);
      
      // Si el flujo no requiere sellos de tiempo y tenemos imágenes, no es necesario procesarlas
      if (!flow.isTimestampSealingRequired() && validImages.length > 0) {
        console.log(`[VerificationFlowResolvers] Tipo de verificación ${flow.getName()} no requiere sellos de tiempo, omitiendo procesamiento`);
        return {
          success: true,
          verificationId,
          timestamps: [],
          error: null
        };
      }
      
      // Procesar la finalización solo si hay imágenes para procesar o no se requieren
      if (validImages.length > 0 || !flow.isTimestampSealingRequired()) {
        const result = await this.verificationFlowService.processFaceTecCompletion(
          verificationId,
          faceTecSessionId,
          validImages
        );
        
        return {
          success: true,
          verificationId,
          timestamps: result.timestamps || [],
          error: null
        };
      } else if (flow.isTimestampSealingRequired()) {
        // Si requiere sellos de tiempo pero no hay imágenes, es un problema
        console.warn(`[VerificationFlowResolvers] Se requieren sellos de tiempo pero no hay imágenes válidas`);
        return {
          success: false,
          verificationId,
          timestamps: [],
          error: 'No se proporcionaron imágenes para sellar con timestamp'
        };
      } else {
        // Caso simple donde no hay imágenes pero tampoco se requieren
        return {
          success: true,
          verificationId,
          timestamps: [],
          error: null
        };
      }
    } catch (error) {
      console.error(`[VerificationFlowResolvers] Error en processFaceTecCompletion:`, error);
      return {
        success: false,
        verificationId: verificationId || '',
        timestamps: null,
        error: (error as Error).message || 'Error desconocido en el procesamiento'
      };
    }
  }

  async validateINE(
    parent: any,
    { verificationId, cic, identificador }: { verificationId: string; cic: string; identificador: string }
  ): Promise<any> {
    try {
      const success = await this.verificationFlowService.validateINE(verificationId, cic, identificador);
      
      return {
        success,
        error: success ? null : 'INE validation failed'
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  async validateCURP(
    parent: any,
    { verificationId, curp }: { verificationId: string; curp: string }
  ): Promise<any> {
    try {
      const success = await this.verificationFlowService.validateCURP(verificationId, curp);
      
      return {
        success,
        error: success ? null : 'CURP validation failed'
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
} 