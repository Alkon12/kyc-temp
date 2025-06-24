import { useState, useEffect } from 'react';
import { ApolloClient, useLazyQuery } from '@apollo/client';
import FacetecDataExtractor, { PersonalData } from '@/lib/FaceTec/adapters/FacetecDataExtractor';
import ClientVerificationFlowService from '@/services/ClientVerificationFlowService';
import { useCurpValidation } from '@/hooks/useCurpValidation';
import { useFuzzyValidation } from '@/hooks/useFuzzyValidation';
import { useListaNominalValidation } from '@/hooks/useListaNominalValidation';
import { GET_FACETEC_RESULTS } from '../graphql/queries';

interface UseFaceTecDataProps {
  verificationIdFromQuery?: string;
  data?: any;
  publicClient: ApolloClient<any>;
  firstName: string;
  lastName: string;
  token?: string;
}

export const useFaceTecData = ({
  verificationIdFromQuery,
  data,
  publicClient,
  firstName, 
  lastName,
  token
}: UseFaceTecDataProps) => {
  const [extractedPersonalData, setExtractedPersonalData] = useState<PersonalData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Hooks de validaciones existentes
  const { 
    isValidating: isCurpValidating, 
    isSaving: isCurpSaving,
    isUpdatingKycStatus: isCurpUpdatingKycStatus,
    validationResult: curpValidationResult, 
    savedVerificationId: curpSavedVerificationId,
    error: curpValidationError,
    validateCurpFromPersonalData 
  } = useCurpValidation();
  
  const {
    isValidating: isFuzzyValidating,
    isSaving: isFuzzySaving,
    isUpdatingKycStatus: isFuzzyUpdatingKycStatus,
    validationResult: fuzzyValidationResult,
    savedVerificationId: fuzzySavedVerificationId,
    error: fuzzyValidationError,
    validateFuzzyMatch
  } = useFuzzyValidation();
  
  const {
    isValidating: isListaNominalValidating,
    isSaving: isListaNominalSaving,
    isUpdatingKycStatus: isListaNominalUpdatingKycStatus,
    validationResult: listaNominalValidationResult,
    savedVerificationId: listaNominalSavedVerificationId,
    error: listaNominalValidationError,
    validateListaNominalFromPersonalData
  } = useListaNominalValidation();

  // Crear instancia del extractor de datos FaceTec
  const facetecDataExtractor = new FacetecDataExtractor(publicClient);

  // Query para obtener FaceTec Results
  const [getFacetecResults, { loading: loadingFaceTecResults }] = useLazyQuery(GET_FACETEC_RESULTS, {
    onCompleted: async (facetecData) => {
      console.log('FaceTec Results obtenidos:', facetecData);
      await processFaceTecResults(facetecData);
    },
    onError: (error) => {
      console.error('Error al obtener FaceTec Results:', error);
    }
  });

  // Función para procesar resultados de FaceTec
  const processFaceTecResults = async (facetecData: any) => {
    if (facetecData.getFacetecResultsByVerificationId && facetecData.getFacetecResultsByVerificationId.length > 0) {
      const latestResult = facetecData.getFacetecResultsByVerificationId[0];
      
      if (latestResult.fullResponse) {
        try {
          // Verificar e inicializar el servicio si es necesario
          if (!ClientVerificationFlowService.isInitialized()) {
            console.log('ADVERTENCIA: Flujo de verificación no inicializado todavía');
            const verificationType = data?.getVerificationLinkByToken?.kycVerification?.verificationType;
            
            if (verificationType) {
              ClientVerificationFlowService.initialize(verificationType);
              console.log(`Flujo de verificación inicializado con tipo: ${verificationType}`);
            }
          }
          
          // Extraer datos del documento
          const personalData = facetecDataExtractor.extractPersonalDataFromFaceTecResult(
            latestResult.fullResponse
          );
          
          if (personalData) {
            setExtractedPersonalData(personalData);
            await processValidations(personalData, latestResult.verificationId);
          }
        } catch (error) {
          console.error('Error al procesar datos del documento:', error);
        }
      }
    }
  };

  // Función para procesar todas las validaciones
  const processValidations = async (personalData: PersonalData, verificationId: string) => {
    const personalDataFullName = `${personalData.firstName || ''} ${personalData.lastName || ''}`.trim();
    console.log('👤 Nombre completo desde personalData:', personalDataFullName);
    
    const vId = verificationId || verificationIdFromQuery || data?.getVerificationLinkByToken?.verificationId;
    const shouldSave = Boolean(vId);
    
    let curpFullName = null;

    // Validación CURP
    if (ClientVerificationFlowService.isCURPValidationRequired()) {
      console.log('Validación CURP requerida por el flujo de verificación');
      
      try {
        const result = await validateCurpFromPersonalData(personalData, token || null, {
          verificationId: vId,
          saveResult: shouldSave
        });
        
        // Extraer nombre completo de la respuesta CURP
        if (result.success && result.data) {
          try {
            let curpData: any = result.data;
            
            if (typeof curpData === 'string') {
              try {
                curpData = JSON.parse(curpData);
              } catch (e) {
                console.error('[FUZZY] Error al parsear string de CURP data:', e);
              }
            }
            
            const dataObject = curpData.data || curpData;
            
            if (dataObject) {
              const curpFirstName = dataObject.nombre || '';
              const curpLastName1 = dataObject.apellidoPaterno || '';
              const curpLastName2 = dataObject.apellidoMaterno || '';
              
              if (curpFirstName || curpLastName1 || curpLastName2) {
                curpFullName = `${curpFirstName} ${curpLastName1} ${curpLastName2}`.trim();
                console.log('👤 Nombre completo extraído de CURP:', curpFullName);
              }
            }
          } catch (parseError) {
            console.error('[FUZZY] Error al extraer datos de nombre de respuesta CURP:', parseError);
          }
        }
      } catch (validationError) {
        console.error('Error durante la validación o guardado de CURP:', validationError);
      }
    }

    // Validación Fuzzy
    if (ClientVerificationFlowService.isFuzzyValidationRequired()) {
      console.log('Validación fuzzy de nombres requerida por el flujo de verificación');
      
      const baseName = `${firstName} ${lastName}`.trim();
      console.log('Nombre base para validación fuzzy:', baseName);
      
      if (baseName) {
        try {
          const candidatos = [];
          
          if (personalDataFullName) {
            candidatos.push(personalDataFullName);
          }
          
          if (curpFullName) {
            candidatos.push(curpFullName);
          }
          
          console.log('Candidatos para validación fuzzy:', candidatos);
          
          const fuzzyResult = await validateFuzzyMatch(
            baseName,
            candidatos,
            {
              verificationId: vId,
              saveResult: shouldSave,
              threshold: 0.7
            }
          );
          
          console.log('Resultado de validación fuzzy:', fuzzyResult);
          
          if (fuzzyResult.bestMatch) {
            console.log('👤 Mejor coincidencia fuzzy:', 
              fuzzyResult.bestMatch.text, 
              `(score: ${fuzzyResult.bestMatch.score.toFixed(2)})`
            );
          }
        } catch (validationError) {
          console.error('Error durante la validación o guardado fuzzy:', validationError);
        }
      }
    }
    
    // Validación Lista Nominal
    if (ClientVerificationFlowService.isINEValidationRequired()) {
      console.log('Validación de Lista Nominal requerida por el flujo de verificación');
      
      try {
        const result = await validateListaNominalFromPersonalData(personalData, token || null, {
          verificationId: vId,
          saveResult: shouldSave
        });
        
        const isListaNominalSuccess = result.success || result.data?.estado === 3;
        console.log('Validación de Lista Nominal:', isListaNominalSuccess ? 'Exitosa' : 'Fallida', 
          'Estado:', result.data?.estado, 
          'Mensaje:', result.message);
      } catch (validationError) {
        console.error('Error durante la validación o guardado de Lista Nominal:', validationError);
      }
    }
  };

  // Actualizar el estado de procesamiento
  useEffect(() => {
    const isAnyProcessing = isCurpValidating || 
                           isListaNominalValidating || 
                           isCurpSaving || 
                           isListaNominalSaving || 
                           isCurpUpdatingKycStatus || 
                           isListaNominalUpdatingKycStatus ||
                           isFuzzyValidating ||
                           isFuzzySaving ||
                           isFuzzyUpdatingKycStatus ||
                           loadingFaceTecResults;
    
    setIsProcessing(isAnyProcessing);
  }, [
    isCurpValidating, isListaNominalValidating, isCurpSaving, isListaNominalSaving,
    isCurpUpdatingKycStatus, isListaNominalUpdatingKycStatus, isFuzzyValidating,
    isFuzzySaving, isFuzzyUpdatingKycStatus, loadingFaceTecResults
  ]);

  return {
    extractedPersonalData,
    isProcessing,
    getFacetecResults,
    validationResults: {
      curp: curpValidationResult,
      fuzzy: fuzzyValidationResult,
      listaNominal: listaNominalValidationResult
    },
    validationErrors: {
      curp: curpValidationError,
      fuzzy: fuzzyValidationError,
      listaNominal: listaNominalValidationError
    },
    savedVerificationIds: {
      curp: curpSavedVerificationId,
      fuzzy: fuzzySavedVerificationId,
      listaNominal: listaNominalSavedVerificationId
    }
  };
}; 