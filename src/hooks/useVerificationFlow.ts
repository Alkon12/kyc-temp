import { useState, useEffect } from 'react';
import ClientVerificationFlowService from '@/services/ClientVerificationFlowService';

/**
 * Hook personalizado para manejar la inicialización del flujo de verificación
 * @param verificationId ID de la verificación (opcional)
 * @param verificationType Tipo de verificación
 * @param apolloClient Cliente Apollo (opcional)
 * @returns Estado y configuración del flujo de verificación
 */
export function useVerificationFlow(
  verificationId: string | null | undefined,
  verificationType: string | null | undefined
) {
  const [flowServiceInitialized, setFlowServiceInitialized] = useState(false);
  const [flowSettings, setFlowSettings] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeFlowService() {
      if (verificationType && !flowServiceInitialized) {
        try {
          // Usar initialize con el tipo que ya tenemos
          ClientVerificationFlowService.initialize(verificationType);
          setFlowServiceInitialized(true);
          
          // Configurar flowSettings basado en el tipo de verificación
          const newFlowSettings = {
            type: verificationType,
            isContactFormRequired: ClientVerificationFlowService.isContactFormRequired(),
            isTimestampSealingRequired: ClientVerificationFlowService.isTimestampSealingRequired(),
            isINEValidationRequired: ClientVerificationFlowService.isINEValidationRequired(),
            isCURPValidationRequired: ClientVerificationFlowService.isCURPValidationRequired(),
            nextStepAfterFaceTec: ClientVerificationFlowService.getNextStepAfterFaceTec()
          };
          
          setFlowSettings(newFlowSettings);
          
          console.log('Servicio de flujo inicializado correctamente', {
            verificationType: ClientVerificationFlowService.getVerificationType(),
            isBronze: ClientVerificationFlowService.isBronzeVerification(),
            isSilver: ClientVerificationFlowService.isSilverVerification(),
            isGold: ClientVerificationFlowService.isGoldVerification(),
            requiresContactForm: ClientVerificationFlowService.isContactFormRequired(),
            requiresCurp: ClientVerificationFlowService.isCURPValidationRequired()
          });
        } catch (error) {
          console.error('Error al inicializar el servicio de flujo:', error);
          setError(`Error al cargar datos de verificación: ${(error as Error).message}`);
        }
      }
    }
    
    initializeFlowService();
  }, [verificationId, verificationType, flowServiceInitialized]);

  return {
    flowServiceInitialized,
    flowSettings,
    error,
    setError,
    service: ClientVerificationFlowService
  };
} 