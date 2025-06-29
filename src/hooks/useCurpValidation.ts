import { useState } from 'react';
import { PersonalData } from '@/lib/FaceTec/adapters/FacetecDataExtractor';
import { CurpValidationService } from '@/services/CurpValidationService';
import { CurpValidationResult } from '@/domain/integration/ValidationTypes';
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
 * Hook personalizado para manejar la validación de CURP en componentes de React
 * Utiliza el servicio centralizado CurpValidationService y mantiene estado de UI
 */
export const useCurpValidation = () => {
  const apolloClient = useApolloClient();
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<CurpValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedVerificationId, setSavedVerificationId] = useState<string | null>(null);
  const [isUpdatingKycStatus, setIsUpdatingKycStatus] = useState(false);

  // Inicializar el servicio de estado de validación
  const validationStatusService = new ValidationStatusService(apolloClient);

  // Configurar la mutación para guardar resultados
  const [createExternalVerification, { loading: isSaving }] = useMutation(CREATE_EXTERNAL_VERIFICATION, {
    onCompleted: (data) => {
      console.log('Resultado de validación CURP guardado exitosamente:', data);
      setSavedVerificationId(data.createExternalVerification.id);
    },
    onError: (error) => {
      console.error('Error al guardar resultado de validación CURP:', error);
    }
  });

  /**
   * Extrae la CURP de los datos personales obtenidos del documento
   */
  const extractCurpFromPersonalData = (personalData: PersonalData): string | null => {
    // La CURP puede estar en diferentes campos según el tipo de documento
    const curp = personalData.curp || personalData.idNumber2 || null;
    
    if (!curp) {
      console.warn('No se pudo encontrar CURP en los datos personales extraídos');
    } else {
      console.log('CURP extraída de los datos personales:', curp);
    }
    
    return curp;
  };

  /**
   * Actualiza el estado de la verificación KYC basado en el resultado de la validación
   */
  const updateKycVerificationStatus = async (
    verificationId: string,
    result: CurpValidationResult
  ): Promise<boolean> => {
    if (!verificationId) {
      return false;
    }

    setIsUpdatingKycStatus(true);
    try {
      const success = await validationStatusService.updateKycStatusFromValidation(
        verificationId,
        result,
        'CURP'
      );
      return success;
    } catch (error) {
      console.error('Error al actualizar estado de verificación KYC para CURP:', error);
      return false;
    } finally {
      setIsUpdatingKycStatus(false);
    }
  };

  /**
   * Guarda el resultado de la validación CURP mediante GraphQL
   */
  const saveValidationResult = async (
    verificationId: string | undefined | null,
    curp: string,
    result: CurpValidationResult
  ) => {
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
                provider: "RENAPO",
                verificationType: "IDENTITY", // CURP validation is an IDENTITY verification type
                requestData: JSON.stringify({ 
                  curp,
                  type: "CURP_VALIDATION" // Incluir el tipo específico en los datos de la solicitud
                }),
                responseData: JSON.stringify({
                  ...result,
                  validationType: "CURP", // Agregar el tipo específico de validación en la respuesta
                  savedAt: new Date().toISOString() // Añadir timestamp para referencia
                }),
                status: status // Usar el estado determinado
              }
            }
          });
          
          console.log(`Resultado de validación CURP guardado con estado: ${status}`);
          return !!response.data?.createExternalVerification;
        } catch (error) {
          console.error('Error al guardar validación CURP:', error);
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
          'CURP'
        );
      } finally {
        setIsUpdatingKycStatus(false);
      }
    } catch (error) {
      console.error('Error al procesar validación CURP:', error);
      return false;
    }
  };

  /**
   * Realiza la validación de CURP a partir de los datos personales extraídos
   * y opcionalmente guarda el resultado mediante GraphQL
   */
  const validateCurpFromPersonalData = async (
    personalData: PersonalData,
    token: string | null,
    options: { verificationId?: string, saveResult?: boolean } = {}
  ): Promise<CurpValidationResult> => {
    setIsValidating(true);
    setError(null);
    
    try {
      // Extraer CURP de los datos personales
      const extractedCurp = extractCurpFromPersonalData(personalData);
      
      // Si no se encuentra CURP o no hay token, devolver error
      if (!extractedCurp || !token) {
        const errorMessage = !extractedCurp 
          ? 'No se pudo encontrar CURP en los datos extraídos'
          : 'No se proporcionó token para validación';
          
        setError(errorMessage);
        
        const result: CurpValidationResult = {
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
      
      // Usar el servicio centralizado para validar la CURP
      const result = await CurpValidationService.validateCurp(extractedCurp, token, personalData);
      
      // Si hay error, actualizar el estado de error
      if (!result.success) {
        setError(result.message);
      }
      
      setValidationResult(result);
      
      // Si se especificó guardar el resultado y tenemos ID de verificación
      if (options.saveResult && options.verificationId && extractedCurp) {
        await saveValidationResult(options.verificationId, extractedCurp, result);
      }
      // Si tenemos ID de verificación y la validación falló pero no se pidió guardar, actualizar el estado de la verificación
      else if (!result.success && options.verificationId && !options.saveResult) {
        await updateKycVerificationStatus(options.verificationId, result);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido en la validación de CURP';
      setError(errorMessage);
      
      const result: CurpValidationResult = {
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
   * Valida una CURP directamente (sin extraerla de datos personales)
   * y opcionalmente guarda el resultado mediante GraphQL
   */
  const validateCurp = async (
    curp: string, 
    token: string,
    options: { verificationId?: string, saveResult?: boolean } = {}
  ): Promise<CurpValidationResult> => {
    setIsValidating(true);
    setError(null);
    
    try {
      // Usar el servicio centralizado para validar la CURP
      const result = await CurpValidationService.validateCurp(curp, token);
      
      // Si hay error, actualizar el estado de error
      if (!result.success) {
        setError(result.message);
      }
      
      setValidationResult(result);
      
      // Si se especificó guardar el resultado y tenemos ID de verificación
      if (options.saveResult && options.verificationId) {
        await saveValidationResult(options.verificationId, curp, result);
      }
      // Si tenemos ID de verificación y la validación falló pero no se pidió guardar, actualizar el estado de la verificación
      else if (!result.success && options.verificationId && !options.saveResult) {
        await updateKycVerificationStatus(options.verificationId, result);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido en la validación de CURP';
      setError(errorMessage);
      
      const result: CurpValidationResult = {
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
    validateCurp,
    validateCurpFromPersonalData,
    extractCurpFromPersonalData,
    saveValidationResult,
    updateKycVerificationStatus
  };
}; 