import { useState } from 'react';
import { PersonalData } from '@/lib/FaceTec/adapters/FacetecDataExtractor';
import { ListaNominalValidationService } from '@/services/ListaNominalValidationService';
import { ListaNominalResult } from '@/domain/integration/ValidationTypes';
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
 * Hook personalizado para manejar la validación de Lista Nominal en componentes de React
 * Utiliza el servicio centralizado ListaNominalValidationService y mantiene estado de UI
 */
export const useListaNominalValidation = () => {
  const apolloClient = useApolloClient();
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ListaNominalResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedVerificationId, setSavedVerificationId] = useState<string | null>(null);
  const [isUpdatingKycStatus, setIsUpdatingKycStatus] = useState(false);

  // Inicializar el servicio de estado de validación
  const validationStatusService = new ValidationStatusService(apolloClient);

  // Configurar la mutación para guardar resultados
  const [createExternalVerification, { loading: isSaving }] = useMutation(CREATE_EXTERNAL_VERIFICATION, {
    onCompleted: (data) => {
      console.log('Resultado de validación Lista Nominal guardado exitosamente:', data);
      setSavedVerificationId(data.createExternalVerification.id);
    },
    onError: (error) => {
      console.error('Error al guardar resultado de validación Lista Nominal:', error);
    }
  });

  /**
   * Extrae el MRZ Line 1 de los datos personales obtenidos del documento
   */
  const extractMrzLine1FromPersonalData = (personalData: PersonalData): string | null => {
    // El MRZ Line 1 puede estar en diferentes campos según el tipo de documento
    const mrzLine1 = personalData.mrzLine1 || null;
    
    if (!mrzLine1) {
      console.warn('No se pudo encontrar MRZ Line 1 en los datos personales extraídos');
    } else {
      console.log('MRZ Line 1 extraído de los datos personales:', mrzLine1);
    }
    
    return mrzLine1;
  };

  /**
   * Actualiza el estado de la verificación KYC basado en el resultado de la validación
   */
  const updateKycVerificationStatus = async (
    verificationId: string,
    result: ListaNominalResult
  ): Promise<boolean> => {
    if (!verificationId) {
      return false;
    }

    setIsUpdatingKycStatus(true);
    try {
      const success = await validationStatusService.updateKycStatusFromValidation(
        verificationId,
        result,
        'Lista Nominal'
      );
      return success;
    } catch (error) {
      console.error('Error al actualizar estado de verificación KYC para Lista Nominal:', error);
      return false;
    } finally {
      setIsUpdatingKycStatus(false);
    }
  };

  /**
   * Guarda el resultado de la validación Lista Nominal mediante GraphQL
   */
  const saveValidationResult = async (
    verificationId: string | undefined | null,
    cic: string,
    identificador: string,
    result: ListaNominalResult
  ) => {
    if (!verificationId) {
      console.error('No se puede guardar el resultado sin un ID de verificación');
      return false;
    }
    
    try {
      // Determinar el estado usando los valores válidos
      // Para Lista Nominal, el estado 3 significa "vigente" y es un resultado exitoso
      let status = "failed";
      
      if (result.success) {
        status = "completed";
      } else if (result.data?.estado === 3) { 
        // Incluso si result.success es false pero el estado es 3, considerarlo como exitoso
        status = "completed";
      }
      
      // Crea una función para guardar el resultado en la validación externa
      const saveExternalVerification = async () => {
        try {
          const response = await createExternalVerification({
            variables: {
              input: {
                verificationId,
                provider: "INE",
                verificationType: "IDENTITY", // Lista Nominal validation is an IDENTITY verification type
                requestData: JSON.stringify({ 
                  cic,
                  identificador,
                  type: "LISTA_NOMINAL_VALIDATION" // Incluir el tipo específico en los datos de la solicitud
                }),
                responseData: JSON.stringify({
                  ...result,
                  validationType: "LISTA_NOMINAL", // Agregar el tipo específico de validación en la respuesta
                  savedAt: new Date().toISOString() // Añadir timestamp para referencia
                }),
                status: status // Usar el estado determinado
              }
            }
          });
          
          console.log(`Resultado de validación Lista Nominal guardado con estado: ${status}`);
          return !!response.data?.createExternalVerification;
        } catch (error) {
          console.error('Error al guardar validación Lista Nominal:', error);
          return false;
        }
      };
      
      setIsUpdatingKycStatus(true);
      try {
        // Si el estado es "failed", se actualizará el KYC status a través del servicio
        // Si es "completed", no afectará al KYC status
        return await validationStatusService.handleValidationResult(
          verificationId,
          result,
          saveExternalVerification,
          'Lista Nominal'
        );
      } finally {
        setIsUpdatingKycStatus(false);
      }
    } catch (error) {
      console.error('Error al procesar validación Lista Nominal:', error);
      return false;
    }
  };

  /**
   * Realiza la validación de Lista Nominal a partir de los datos personales extraídos
   * y opcionalmente guarda el resultado mediante GraphQL
   */
  const validateListaNominalFromPersonalData = async (
    personalData: PersonalData,
    token: string | null,
    options: { verificationId?: string, saveResult?: boolean } = {}
  ): Promise<ListaNominalResult> => {
    setIsValidating(true);
    setError(null);
    
    try {
      // Extraer MRZ Line 1 de los datos personales
      const extractedMrzLine1 = extractMrzLine1FromPersonalData(personalData);
      
      // Si no se encuentra MRZ Line 1 o no hay token, devolver error
      if (!extractedMrzLine1 || !token) {
        const errorMessage = !extractedMrzLine1 
          ? 'No se pudo encontrar MRZ Line 1 en los datos extraídos'
          : 'No se proporcionó token para validación';
          
        setError(errorMessage);
        
        const result: ListaNominalResult = {
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
      
      // Extraer CIC e Identificador del MRZ Line 1
      const { cic, identificador } = ListaNominalValidationService.extractCicAndIdentificador(extractedMrzLine1);
      
      if (!cic || !identificador) {
        const errorMessage = 'No se pudo extraer CIC o Identificador del MRZ Line 1';
        setError(errorMessage);
        
        const result: ListaNominalResult = {
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
      
      // Usar el servicio centralizado para validar la Lista Nominal
      const result = await ListaNominalValidationService.validateListaNominal(extractedMrzLine1, token, personalData);
      
      // Ajustar el success basado en el valor de estado para evitar falsos negativos
      // Estado 3 significa "vigente" para Lista Nominal y debe considerarse como éxito
      if (!result.success && result.data?.estado === 3) {
        result.success = true;
        console.log('Ajustando resultado de validación Lista Nominal a success=true porque estado=3 indica INE vigente');
      }
      
      // Si hay error, actualizar el estado de error
      if (!result.success) {
        setError(result.message);
      }
      
      setValidationResult(result);
      
      // Si se especificó guardar el resultado y tenemos ID de verificación
      if (options.saveResult && options.verificationId && cic && identificador) {
        await saveValidationResult(options.verificationId, cic, identificador, result);
      } 
      // Si tenemos ID de verificación y la validación falló pero no se pidió guardar, actualizar el estado de la verificación
      else if (!result.success && options.verificationId && !options.saveResult) {
        await updateKycVerificationStatus(options.verificationId, result);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido en la validación de Lista Nominal';
      setError(errorMessage);
      
      const result: ListaNominalResult = {
        success: false,
        message: errorMessage,
        error: String(error)
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
   * Valida directamente con CIC e Identificador
   * y opcionalmente guarda el resultado mediante GraphQL
   */
  const validateListaNominal = async (
    cic: string, 
    identificador: string,
    token: string,
    options: { verificationId?: string, saveResult?: boolean } = {}
  ): Promise<ListaNominalResult> => {
    setIsValidating(true);
    setError(null);
    
    try {
      // Crear un MRZ sintético para la validación directa
      const syntheticMrz = `IDMEX${cic}<<1234${identificador}`;
      
      // Usar el servicio centralizado para validar la Lista Nominal
      const result = await ListaNominalValidationService.validateListaNominal(syntheticMrz, token);
      
      // Ajustar el success basado en el valor de estado para evitar falsos negativos
      // Estado 3 significa "vigente" para Lista Nominal y debe considerarse como éxito
      if (!result.success && result.data?.estado === 3) {
        result.success = true;
        console.log('Ajustando resultado de validación Lista Nominal a success=true porque estado=3 indica INE vigente');
      }
      
      // Si hay error, actualizar el estado de error
      if (!result.success) {
        setError(result.message);
      }
      
      setValidationResult(result);
      
      // Si se especificó guardar el resultado y tenemos ID de verificación
      if (options.saveResult && options.verificationId) {
        await saveValidationResult(options.verificationId, cic, identificador, result);
      }
      // Si tenemos ID de verificación y la validación falló pero no se pidió guardar, actualizar el estado de la verificación
      else if (!result.success && options.verificationId && !options.saveResult) {
        await updateKycVerificationStatus(options.verificationId, result);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido en la validación de Lista Nominal';
      setError(errorMessage);
      
      const result: ListaNominalResult = {
        success: false,
        message: errorMessage,
        error: String(error)
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
    validateListaNominal,
    validateListaNominalFromPersonalData,
    extractMrzLine1FromPersonalData,
    saveValidationResult,
    updateKycVerificationStatus
  };
}; 