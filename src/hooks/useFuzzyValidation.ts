import { useState } from 'react';
import { PersonalData } from '@/lib/FaceTec/adapters/FacetecDataExtractor';
import { FuzzyMatchService, FuzzyMatchResult } from '@/services/FuzzyMatchService';
import { gql, useMutation, useApolloClient } from '@apollo/client';
import ValidationStatusService from '@/services/ValidationStatusService';

// Definir la mutación para guardar resultados de verificación externa
const CREATE_EXTERNAL_VERIFICATION = gql`
  mutation CreateExternalVerification($input: CreateExternalVerificationInput!) {
    createExternalVerification(input: $input) {
      id
      verificationId
      provider
      verificationType
      requestData
      responseData
      status
      createdAt
    }
  }
`;

/**
 * Hook personalizado para manejar la validación fuzzy de nombres en componentes de React
 * Utiliza el servicio centralizado FuzzyMatchService y mantiene estado de UI
 */
export const useFuzzyValidation = () => {
  const apolloClient = useApolloClient();
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<FuzzyMatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedVerificationId, setSavedVerificationId] = useState<string | null>(null);
  const [isUpdatingKycStatus, setIsUpdatingKycStatus] = useState(false);

  // Inicializar el servicio de estado de validación
  const validationStatusService = new ValidationStatusService(apolloClient);

  // Configurar la mutación para guardar resultados
  const [createExternalVerification, { loading: isSaving }] = useMutation(CREATE_EXTERNAL_VERIFICATION, {
    onCompleted: (data) => {
      console.log('Resultado de validación Fuzzy guardado exitosamente:', data);
      setSavedVerificationId(data.createExternalVerification.id);
    },
    onError: (error) => {
      console.error('Error al guardar resultado de validación Fuzzy:', error);
    }
  });

  /**
   * Actualiza el estado de la verificación KYC basado en el resultado de la validación
   */
  const updateKycVerificationStatus = async (
    verificationId: string,
    result: FuzzyMatchResult
  ): Promise<boolean> => {
    if (!verificationId) {
      return false;
    }

    setIsUpdatingKycStatus(true);
    try {
      const success = await validationStatusService.updateKycStatusFromValidation(
        verificationId,
        result,
        'FUZZY'
      );
      return success;
    } catch (error) {
      console.error('Error al actualizar estado de verificación KYC para validación Fuzzy:', error);
      return false;
    } finally {
      setIsUpdatingKycStatus(false);
    }
  };

  /**
   * Guarda el resultado de la validación Fuzzy mediante GraphQL
   */
  const saveValidationResult = async (
    verificationId: string | undefined | null,
    baseName: string,
    candidates: string[],
    result: FuzzyMatchResult
  ): Promise<boolean> => {
    if (!verificationId) {
      console.error('No se puede guardar el resultado sin un ID de verificación');
      return false;
    }
    
    try {
      // Determinar el estado usando los valores válidos
      const status = result.success ? "completed" : "failed";
      
      // Crea una función para guardar el resultado en la validación externa
      const saveExternalVerification = async () => {
        try {
          const response = await createExternalVerification({
            variables: {
              input: {
                verificationId,
                provider: "INTERNAL",
                verificationType: "IDENTITY", // Fuzzy validation is an IDENTITY verification type
                requestData: JSON.stringify({ 
                  baseName,
                  candidates,
                  threshold: result.threshold,
                  type: "FUZZY_NAME_MATCH" // Incluir el tipo específico en los datos de la solicitud
                }),
                responseData: JSON.stringify({
                  ...result,
                  validationType: "FUZZY", // Agregar el tipo específico de validación en la respuesta
                  savedAt: new Date().toISOString() // Añadir timestamp para referencia
                }),
                status: status // Usar el estado determinado
              }
            }
          });
          
          console.log(`Resultado de validación Fuzzy guardado con estado: ${status}`);
          return !!response.data?.createExternalVerification;
        } catch (error) {
          console.error('Error al guardar validación Fuzzy:', error);
          return false;
        }
      };
      
      setIsUpdatingKycStatus(true);
      try {
        // Usar el servicio para guardar el resultado y actualizar el estado KYC si es necesario
        return await validationStatusService.handleValidationResult(
          verificationId,
          result,
          saveExternalVerification,
          'FUZZY'
        );
      } finally {
        setIsUpdatingKycStatus(false);
      }
    } catch (error) {
      console.error('Error al procesar validación Fuzzy:', error);
      return false;
    }
  };

  /**
   * Realiza la validación fuzzy de nombres a partir de múltiples fuentes
   * y opcionalmente guarda el resultado mediante GraphQL
   */
  const validateFuzzyMatchFromPersonalData = async (
    personalData: PersonalData,
    queryName: string | null,
    curpName: string | null = null,
    token: string | null = null,
    options: { verificationId?: string, saveResult?: boolean, threshold?: number } = {}
  ): Promise<FuzzyMatchResult> => {
    setIsValidating(true);
    setError(null);
    
    try {
      // Construir nombres completos para comparación
      const fullName = queryName;
      const personalDataFullName = personalData ? 
        `${personalData.firstName || ''} ${personalData.lastName || ''}`.trim() : null;
      
      // Si no hay nombres para comparar, devolver error
      if (!fullName || !personalDataFullName) {
        const errorMessage = !fullName 
          ? 'No se proporcionó nombre base para validación fuzzy'
          : 'No se obtuvieron datos personales para validación fuzzy';
          
        setError(errorMessage);
        
        const result: FuzzyMatchResult = {
          success: false,
          message: errorMessage
        };
        
        setValidationResult(result);
        
        // Si tenemos ID de verificación y error de validación, actualizar el estado de la verificación
        if (options.verificationId) {
          await updateKycVerificationStatus(options.verificationId, result);
        }
        
        return result;
      }
      
      // Obtener candidatos para validación
      const candidates = FuzzyMatchService.extractNamesForFuzzyValidation(
        personalData,
        queryName,
        curpName
      );
      
      // Usar el servicio centralizado para validación fuzzy
      const threshold = options.threshold || 0.7;
      const result = await FuzzyMatchService.validateFuzzyMatch(
        fullName,
        candidates,
        token,
        threshold
      );
      
      // Si hay error, actualizar el estado de error
      if (!result.success) {
        setError(result.message || 'Error en validación fuzzy');
      }
      
      setValidationResult(result);
      
      // Si se especificó guardar el resultado y tenemos ID de verificación
      if (options.saveResult && options.verificationId) {
        await saveValidationResult(options.verificationId, fullName, candidates, result);
      }
      // Si tenemos ID de verificación y la validación falló pero no se pidió guardar, actualizar el estado de la verificación
      else if (!result.success && options.verificationId && !options.saveResult) {
        await updateKycVerificationStatus(options.verificationId, result);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido en la validación fuzzy';
      setError(errorMessage);
      
      const result: FuzzyMatchResult = {
        success: false,
        message: errorMessage,
        error
      };
      
      setValidationResult(result);
      
      // Si tenemos ID de verificación y error en la validación, actualizar el estado de la verificación
      if (options.verificationId) {
        await updateKycVerificationStatus(options.verificationId, result);
      }
      
      return result;
    } finally {
      setIsValidating(false);
    }
  };

  /**
   * Realiza una validación fuzzy directa entre dos conjuntos de nombres
   */
  const validateFuzzyMatch = async (
    baseName: string,
    candidates: string[],
    options: { verificationId?: string, saveResult?: boolean, threshold?: number } = {}
  ): Promise<FuzzyMatchResult> => {
    setIsValidating(true);
    setError(null);
    
    try {
      // Usar el servicio centralizado para validación fuzzy
      const threshold = options.threshold || 0.7;
      const result = await FuzzyMatchService.validateFuzzyMatch(
        baseName,
        candidates,
        null,
        threshold
      );
      
      // Si hay error, actualizar el estado de error
      if (!result.success) {
        setError(result.message || 'Error en validación fuzzy');
      }
      
      setValidationResult(result);
      
      // Si se especificó guardar el resultado y tenemos ID de verificación
      if (options.saveResult && options.verificationId) {
        await saveValidationResult(options.verificationId, baseName, candidates, result);
      }
      // Si tenemos ID de verificación y la validación falló pero no se pidió guardar, actualizar el estado de la verificación
      else if (!result.success && options.verificationId && !options.saveResult) {
        await updateKycVerificationStatus(options.verificationId, result);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido en la validación fuzzy';
      setError(errorMessage);
      
      const result: FuzzyMatchResult = {
        success: false,
        message: errorMessage,
        error
      };
      
      setValidationResult(result);
      
      // Si tenemos ID de verificación y error en la validación, actualizar el estado de la verificación
      if (options.verificationId) {
        await updateKycVerificationStatus(options.verificationId, result);
      }
      
      return result;
    } finally {
      setIsValidating(false);
    }
  };

  return {
    isValidating,
    isSaving,
    isUpdatingKycStatus,
    validationResult,
    error,
    savedVerificationId,
    validateFuzzyMatch,
    validateFuzzyMatchFromPersonalData,
    saveValidationResult,
    updateKycVerificationStatus
  };
};

export default useFuzzyValidation; 