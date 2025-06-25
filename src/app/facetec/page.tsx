"use client"
import React, { useState, useRef, useEffect, Suspense } from "react";
import TerminosCondiciones from "@/components/kyc/TerminosCondiciones";
import FaceTecComponent from "@/components/kyc/FaceTecComponent";
import RechazoTerminos from "@/components/kyc/RechazoTerminos";
import EnlaceExpirado from "@/components/kyc/EnlaceExpirado";
import ContactForm from "@/components/kyc/ContactForm";
import { useSearchParams } from 'next/navigation';
import { gql, useQuery, useMutation, ApolloProvider, useLazyQuery } from '@apollo/client';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import FacetecDataExtractor, { PersonalData } from '@/lib/FaceTec/adapters/FacetecDataExtractor';
import ClientVerificationFlowService from '@/services/ClientVerificationFlowService';
import { useVerificationFlow } from '@/hooks/useVerificationFlow';
import { useCurpValidation } from '@/hooks/useCurpValidation';
import { useFuzzyValidation } from '@/hooks/useFuzzyValidation';
import { useListaNominalValidation } from '@/hooks/useListaNominalValidation';
import { useVerificationStatus } from '@/hooks/useVerificationStatus';
import { useKycPersonUpdate } from '@/hooks/useKycPersonUpdate';
import { Icons } from "@/components/icons";

// Consulta para obtener verificación usando token en lugar del ID
const GET_VERIFICATION_BY_TOKEN = gql`
  query GetVerificationLinkByToken($token: String!) {
    getVerificationLinkByToken(token: $token) {
      id
      verificationId
      token
      status
      kycVerification {
        id
        status
        verificationType
        company {
          companyName
          redirectUrl
        }
        kycPerson {
          id
          firstName
          secondName
          secondLastName
          lastName
          email
          phone
        }
      }
    }
  }
`;

// Nueva consulta para obtener FaceTecResult por verification ID
const GET_FACETEC_RESULTS = gql`
  query GetFacetecResultsByVerificationId($verificationId: String!) {
    getFacetecResultsByVerificationId(verificationId: $verificationId) {
      id
      verificationId
      sessionId
      livenessStatus
      enrollmentStatus
      matchLevel
      fullResponse
      manualReviewRequired
      createdAt
    }
  }
`;

// Mutación para procesar la finalización de FaceTec con validaciones específicas por nivel
const PROCESS_FACETEC_COMPLETION = gql`
  mutation ProcessFaceTecCompletion($verificationId: ID!, $faceTecSessionId: String!, $documentImages: [String!]) {
    processFaceTecCompletion(
      verificationId: $verificationId
      faceTecSessionId: $faceTecSessionId
      documentImages: $documentImages
    ) {
      success
      verificationId
      timestamps {
        success
        timestamp
        date
        error
      }
      error
    }
  }
`;

// Mutación para registrar el acceso
const RECORD_VERIFICATION_LINK_ACCESS = gql`
  mutation RecordVerificationLinkAccess($token: String!) {
    recordVerificationLinkAccess(token: $token) {
      id
      accessCount
      lastAccessedAt
    }
  }
`;

// Crear el cliente de Apollo para el endpoint público
const publicClient = new ApolloClient({
  link: createHttpLink({
    uri: '/api/public/graphql',
  }),
  cache: new InMemoryCache(),
});

// Crear instancia del extractor de datos FaceTec
const facetecDataExtractor = new FacetecDataExtractor(publicClient);

// Loading component for a consistent style
const LoadingScreen = ({ message = "Procesando datos..." }) => (
  <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
    <div className="flex flex-col items-center justify-center space-y-4">
      <Icons.spinner className="h-8 w-8 text-primary animate-spin" />
      <div className="text-xl text-gray-700">{message}</div>
    </div>
  </div>
);

const FaceTecContent: React.FC = () => {
  const [step, setStep] = useState<'terminos' | 'verificacion' | 'rechazo' | 'contacto' | 'completado'>('terminos');
  const [error, setError] = useState<string | null>(null);
  const [enlaceExpirado, setEnlaceExpirado] = useState(false);
  const faceTecRef = useRef<any>(null);
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const [accessRecorded, setAccessRecorded] = useState(false);
  // Estado para almacenar los datos personales extraídos
  const [extractedPersonalData, setExtractedPersonalData] = useState<PersonalData | null>(null);
  const [contactInfoSubmitted, setContactInfoSubmitted] = useState(false);
  
  // Usar el nuevo hook de verificación de estados
  const { 
    isUpdating: isStatusUpdating,
    error: statusUpdateError,
    acceptTerms,
    rejectTerms,
    completeFaceTec,
    completeVerification
  } = useVerificationStatus();
  
  // Incorporar el hook de validación de CURP con datos adicionales
  const { 
    isValidating: isCurpValidating, 
    isSaving: isCurpSaving,
    isUpdatingKycStatus: isCurpUpdatingKycStatus,
    validationResult: curpValidationResult, 
    savedVerificationId: curpSavedVerificationId,
    error: curpValidationError,
    validateCurpFromPersonalData 
  } = useCurpValidation();
  
  // Incorporar el hook de validación Fuzzy
  const {
    isValidating: isFuzzyValidating,
    isSaving: isFuzzySaving,
    isUpdatingKycStatus: isFuzzyUpdatingKycStatus,
    validationResult: fuzzyValidationResult,
    savedVerificationId: fuzzySavedVerificationId,
    error: fuzzyValidationError,
    validateFuzzyMatchFromPersonalData,
    validateFuzzyMatch
  } = useFuzzyValidation();
  
  // Incorporar el hook de validación de Lista Nominal
  const {
    isValidating: isListaNominalValidating,
    isSaving: isListaNominalSaving,
    isUpdatingKycStatus: isListaNominalUpdatingKycStatus,
    validationResult: listaNominalValidationResult,
    savedVerificationId: listaNominalSavedVerificationId,
    error: listaNominalValidationError,
    validateListaNominalFromPersonalData
  } = useListaNominalValidation();

  // Hook para actualizar KycPerson con datos de FaceTec
  const {
    updateKycPersonFromFaceTec,
    isUpdating: isUpdatingKycPerson,
    error: kycPersonUpdateError
  } = useKycPersonUpdate(publicClient);

  const [isProcessing, setIsProcessing] = useState(false);

  // Configurar el servicio de flujo de verificación con el cliente Apollo
  useEffect(() => {
    ClientVerificationFlowService.setApolloClient(publicClient);
  }, []);

  const { loading, data, error: queryError } = useQuery(GET_VERIFICATION_BY_TOKEN, {
    variables: { token },
    skip: !token,
  });

  // Usar el hook personalizado para la inicialización del flujo
  const verificationIdFromQuery = data?.getVerificationLinkByToken?.verificationId;
  const verificationTypeFromQuery = data?.getVerificationLinkByToken?.kycVerification?.verificationType;
  
  // Guardar referencia estable al kycPersonId de la query inicial para evitar confusiones con otras variables 'data'
  const kycPersonIdFromInitialQuery = data?.getVerificationLinkByToken?.kycVerification?.kycPerson?.id;
  
  // Depuración para verificar IDs disponibles
  useEffect(() => {
    if (data?.getVerificationLinkByToken) {
      console.log('🔍 Información de verificación disponible:', {
        verificationIdFromLink: data.getVerificationLinkByToken.verificationId,
        verificationLinkId: data.getVerificationLinkByToken.id,
        kycVerificationId: data.getVerificationLinkByToken.kycVerification?.id,
        kycPersonId: data.getVerificationLinkByToken.kycVerification?.kycPerson?.id,
        redirectUrl: data.getVerificationLinkByToken.kycVerification?.company?.redirectUrl
      });
    }
  }, [data]);
  
  const { 
    flowServiceInitialized, 
    flowSettings, 
    error: flowError,
    setError: setFlowError
  } = useVerificationFlow(verificationIdFromQuery, verificationTypeFromQuery);
  
  // Sincronizar error del flujo con el error del componente
  useEffect(() => {
    if (flowError) {
      setError(flowError);
    }
  }, [flowError]);

  // Añadir este useEffect al grupo existente
  useEffect(() => {
    if (listaNominalValidationError) {
      setError(listaNominalValidationError);
    }
  }, [listaNominalValidationError]);

  // Añadir este useEffect al grupo existente
  useEffect(() => {
    if (fuzzyValidationError) {
      setError(fuzzyValidationError);
    }
  }, [fuzzyValidationError]);

  // Manejar errores de actualización de KycPerson
  useEffect(() => {
    if (kycPersonUpdateError) {
      console.error('Error al actualizar KycPerson:', kycPersonUpdateError);
      // No establecemos error en la UI porque es una operación opcional
      // setError(kycPersonUpdateError);
    }
  }, [kycPersonUpdateError]);

  // Actualizar el estado de procesamiento cuando cualquier validación comienza
  useEffect(() => {
    const isAnyProcessing = isStatusUpdating || 
                           isCurpValidating || 
                           isListaNominalValidating || 
                           isCurpSaving || 
                           isListaNominalSaving || 
                           isCurpUpdatingKycStatus || 
                           isListaNominalUpdatingKycStatus ||
                           isFuzzyValidating ||
                           isFuzzySaving ||
                           isFuzzyUpdatingKycStatus ||
                           isUpdatingKycPerson;
    
    setIsProcessing(isAnyProcessing);
  }, [
    isStatusUpdating,
    isCurpValidating,
    isListaNominalValidating,
    isCurpSaving,
    isListaNominalSaving,
    isCurpUpdatingKycStatus,
    isListaNominalUpdatingKycStatus,
    isFuzzyValidating,
    isFuzzySaving,
    isFuzzyUpdatingKycStatus,
    isUpdatingKycPerson
  ]);

  // Agregar query para FaceTecResults (no se ejecuta automáticamente)
  const [getFacetecResults, { loading: loadingFaceTecResults }] = useLazyQuery(GET_FACETEC_RESULTS, {
    onCompleted: async (data) => {
      console.log('FaceTec Results obtenidos:', data);
      if (data.getFacetecResultsByVerificationId && data.getFacetecResultsByVerificationId.length > 0) {
        const latestResult = data.getFacetecResultsByVerificationId[0];
        
        // Usar el extractor de datos para procesar la respuesta
        if (latestResult.fullResponse) {
          try {
            // Verificar primero si tenemos los datos de verificación necesarios
            if (!ClientVerificationFlowService.isInitialized()) {
              console.log('ADVERTENCIA: Flujo de verificación no inicializado todavía');
              
              // Intentar inicializar el servicio con los datos del token si están disponibles
              const verificationType = data?.getVerificationLinkByToken?.kycVerification?.verificationType;
              
              if (verificationType) {
                ClientVerificationFlowService.initialize(verificationType);
                console.log(`Flujo de verificación inicializado con tipo: ${verificationType}`);
              } else {
                console.log('No se pudo determinar el tipo de verificación, continuando con validación básica');
              }
            }
            
            // Extraer datos del documento
            const personalData = facetecDataExtractor.extractPersonalDataFromFaceTecResult(
              latestResult.fullResponse
            );
            
            console.log('Procesando datos personales extraídos');
            
            // Guardar los datos extraídos en el estado
            if (personalData) {
              console.log("personalData", personalData);
              // Crear nombre completo desde los datos personales extraídos
              const personalDataFullName = `${personalData.firstName || ''} ${personalData.lastName || ''}`.trim();
              console.log('👤 Nombre completo desde personalData:', personalDataFullName);
              
              setExtractedPersonalData(personalData);
              
              // Actualizar KycPerson con los datos extraídos de FaceTec
              if (kycPersonIdFromInitialQuery) {
                console.log('🔄 Actualizando KycPerson con datos de FaceTec:', {
                  kycPersonId: kycPersonIdFromInitialQuery,
                  personalDataKeys: Object.keys(personalData)
                });
                
                try {
                  const updateResult = await updateKycPersonFromFaceTec(
                    kycPersonIdFromInitialQuery,
                    personalData
                  );
                  
                  if (updateResult.success) {
                    console.log('✅ KycPerson actualizado exitosamente con datos de FaceTec');
                  } else {
                    console.error('❌ Error al actualizar KycPerson:', updateResult.error);
                  }
                } catch (kycUpdateError) {
                  console.error('❌ Error al actualizar KycPerson:', kycUpdateError);
                }
              } else {
                console.warn('⚠️ No se pudo obtener kycPersonId, saltando actualización de KycPerson');
              }
              
              // Obtener el ID de verificación para ambas validaciones
              const verificationId = latestResult.verificationId || 
                                    data.getFacetecResultsByVerificationId[0].verificationId ||
                                    verificationIdFromQuery ||
                                    data?.getVerificationLinkByToken?.verificationId;
              
              console.log('Usando verificationId para guardar resultados:', verificationId);
              
              if (!verificationId) {
                console.error('No se pudo determinar el ID de verificación. Datos disponibles:', {
                  latestResultId: latestResult.verificationId,
                  facetecResultsId: data.getFacetecResultsByVerificationId[0]?.verificationId,
                  verificationIdFromQuery,
                  verificationLinkId: data?.getVerificationLinkByToken?.verificationId
                });
                
                console.warn('⚠️ Se continuará con las validaciones pero no se guardarán los resultados');
              }
              
              const shouldSave = Boolean(verificationId);
              
              // Verificar si la validación CURP es requerida usando el servicio centralizado
              let curpFullName = null;
              if (ClientVerificationFlowService.isCURPValidationRequired()) {
                console.log('Validación CURP requerida por el flujo de verificación');
                
                // Validar CURP utilizando el hook y guardar el resultado
                try {
                  const result = await validateCurpFromPersonalData(personalData, token || null, {
                    verificationId,
                    saveResult: shouldSave
                  });
                  
                  // Extraer nombre completo de la respuesta de validación CURP con manejo robusto
                  if (result.success && result.data) {
                    try {
                      // La respuesta CURP puede venir como string JSON dentro de data.data o en otros formatos
                      let curpData: any = result.data;
                      
                      // Si es string, intentar parsear
                      if (typeof curpData === 'string') {
                        try {
                          curpData = JSON.parse(curpData);
                        } catch (e) {
                          console.error('[FUZZY] Error al parsear string de CURP data:', e);
                        }
                      }
                      
                      console.log('[FUZZY] Intentando extraer datos de nombre de CURP:');
                      console.log('CURP data después de parsing:', curpData);
                      
                      // Navegar la estructura de datos para encontrar los campos de nombre
                      // Puede ser curpData.data o curpData.data.data dependiendo de la estructura
                      const dataObject = curpData.data || curpData;
                      
                      if (dataObject) {
                        // Extraer campos de nombre de la respuesta CURP
                        const curpFirstName = dataObject.nombre || '';
                        const curpLastName1 = dataObject.apellidoPaterno || '';
                        const curpLastName2 = dataObject.apellidoMaterno || '';
                        
                        // Construir nombre completo de CURP
                        if (curpFirstName || curpLastName1 || curpLastName2) {
                          curpFullName = `${curpFirstName} ${curpLastName1} ${curpLastName2}`.trim();
                          console.log('👤 Nombre completo extraído de CURP:', curpFullName);
                        }
                      }
                    } catch (parseError) {
                      console.error('[FUZZY] Error al extraer datos de nombre de respuesta CURP:', parseError);
                    }
                  }
                  
                  if (shouldSave) {
                    console.log('Validación de CURP completada', 
                      curpSavedVerificationId ? `y guardada con ID: ${curpSavedVerificationId}` : 'pero no se guardó el resultado'
                    );
                  } else {
                    console.log('Validación de CURP completada pero no se guardó por falta de ID de verificación');
                  }
                  
                  // Imprimir el resultado de la validación para referencia
                  console.log('Resultado de validación CURP:', result.success ? 'Exitoso' : 'Fallido');
                } catch (validationError) {
                  console.error('Error durante la validación o guardado de CURP:', validationError);
                }
              } else {
                console.log('Validación de CURP no requerida para este flujo');
              }

              // Verificar si la validación fuzzy de nombres es requerida
              // Usar el servicio centralizado para determinar si se debe ejecutar
              if (ClientVerificationFlowService.isFuzzyValidationRequired()) {
                console.log('Validación fuzzy de nombres requerida por el flujo de verificación');
                
                // IMPORTANTE: Obtener el nombre directamente desde la información del componente principal
                // que ya está disponible y validado en la variable `firstName` y `lastName`
                const baseName = `${firstName} ${lastName}`.trim();
                
                console.log('Nombre base para validación fuzzy (directamente de kycVerification):', baseName);
                
                if (baseName) {
                  try {
                    // Crear lista de candidatos incluyendo todos los nombres disponibles
                    const candidatos = [];
                    
                    // Añadir el nombre del documento si existe
                    if (personalDataFullName) {
                      candidatos.push(personalDataFullName);
                    }
                    
                    // Añadir el nombre de CURP si está disponible
                    if (curpFullName) {
                      candidatos.push(curpFullName);
                    }
                    
                    console.log('Candidatos para validación fuzzy:', candidatos);
                    
                    // Llamar al servicio de validación fuzzy una sola vez con todos los candidatos
                    const fuzzyResult = await validateFuzzyMatch(
                      baseName,   // La BASE es el nombre del kycVerification
                      candidatos, // Todos los candidatos disponibles
                      {
                        verificationId,
                        saveResult: shouldSave,
                        threshold: 0.7 // Umbral configurable
                      }
                    );
                    
                    console.log('Resultado de validación fuzzy:', fuzzyResult);
                    
                    // Mostrar resultado de la mejor coincidencia
                    if (fuzzyResult.bestMatch) {
                      console.log('👤 Mejor coincidencia fuzzy:', 
                        fuzzyResult.bestMatch.text, 
                        `(score: ${fuzzyResult.bestMatch.score.toFixed(2)})`
                      );
                    }
                    
                    if (shouldSave) {
                      console.log('Validación fuzzy completada', 
                        fuzzySavedVerificationId ? `y guardada con ID: ${fuzzySavedVerificationId}` : 'pero no se guardó el resultado'
                      );
                    } else {
                      console.log('Validación fuzzy completada pero no se guardó por falta de ID de verificación');
                    }
                  } catch (validationError) {
                    console.error('Error durante la validación o guardado fuzzy:', validationError);
                  }
                } else {
                  console.warn('No se pudo obtener el nombre base para validación fuzzy');
                }
              }
                            
              // Verificar si la validación de Lista Nominal es requerida
              // Solo para Gold o cuando INEValidationRequired es true
              if (ClientVerificationFlowService.isINEValidationRequired()) {
                console.log('Validación de Lista Nominal requerida por el flujo de verificación');
                
                try {
                  const result = await validateListaNominalFromPersonalData(personalData, token || null, {
                    verificationId,
                    saveResult: shouldSave
                  });
                  
                  // Imprimir el resultado de la validación para referencia
                  console.log('Resultado de validación Lista Nominal:', result);
                  
                  // Estado 3 significa "vigente" para Lista Nominal y debe considerarse como éxito
                  const isListaNominalSuccess = result.success || result.data?.estado === 3;
                  console.log('Validación de Lista Nominal:', isListaNominalSuccess ? 'Exitosa' : 'Fallida', 
                    'Estado:', result.data?.estado, 
                    'Mensaje:', result.message);
                  
                  if (shouldSave) {
                    console.log('Validación de Lista Nominal completada', 
                      listaNominalSavedVerificationId ? `y guardada con ID: ${listaNominalSavedVerificationId}` : 'pero no se guardó el resultado'
                    );
                  } else {
                    console.log('Validación de Lista Nominal completada pero no se guardó por falta de ID de verificación');
                  }
                } catch (validationError) {
                  console.error('Error durante la validación o guardado de Lista Nominal:', validationError);
                  
                  // Intentar validar sin guardar como fallback
                  if (shouldSave) {
                    console.log('Intentando validar Lista Nominal sin guardar como fallback...');
                    try {
                      const resultWithoutSaving = await validateListaNominalFromPersonalData(personalData, token || null, {
                        saveResult: false
                      });
                      console.log('Validación de Lista Nominal sin guardado completada:', 
                        resultWithoutSaving.success ? 'Exitoso' : 'Fallido'
                      );
                    } catch (fallbackError) {
                      console.error('Error incluso en validación de fallback:', fallbackError);
                    }
                  }
                }
              } else {
                console.log('Validación de Lista Nominal no requerida para este flujo');
              }
              
            } else {
              console.warn('No se pudieron extraer datos personales del documento');
            }
          } catch (error) {
            console.error('Error al procesar datos del documento:', error);
          }
        } else {
          console.warn('No se encontró información del documento en el resultado de FaceTec');
        }
      }
    },
    onError: (error) => {
      console.error('Error al obtener FaceTec Results:', error);
    }
  });

  const [processFaceTecCompletion] = useMutation(PROCESS_FACETEC_COMPLETION, {
    onCompleted: (data) => {
      console.log('FaceTec processed:', data);
      if (data.processFaceTecCompletion.success) {
        // Determine next step based on verification flow
        if (flowSettings && flowSettings.nextStepAfterFaceTec === 'complete') {
          handleVerificationCompleted();
        } else {
          handleShowContactForm();
        }
      } else {
        setError(data.processFaceTecCompletion.error || 'Error processing FaceTec completion');
      }
    },
    onError: (error) => {
      console.error('Error processing FaceTec completion:', error);
      setError(error.message);
    }
  });

  const [recordAccess] = useMutation(RECORD_VERIFICATION_LINK_ACCESS, {
    onCompleted: (data) => {
      console.log('Acceso registrado:', data);
      setAccessRecorded(true);
    },
    onError: (error) => {
      console.error('Error al registrar acceso:', error);
    }
  });

  useEffect(() => {
    if (queryError) {
      console.error('GraphQL Error:', queryError);
      setError(queryError.message);
    }
  }, [queryError]);

  // Log data para depuración
  useEffect(() => {
    if (data) {
      console.log('GraphQL response:', data);
    }
  }, [data]);

  // Registrar el acceso cuando se carga la página
  useEffect(() => {
    if (token && !accessRecorded) {
      recordAccess({ variables: { token } });
    }
  }, [token, recordAccess, accessRecorded]);

  // Efectuar validación de token al cargar la página
  useEffect(() => {
    if (token && !loading && data?.getVerificationLinkByToken) {
      console.log('Validation data:', {
        linkStatus: data.getVerificationLinkByToken.status,
        verificationId: data.getVerificationLinkByToken.verificationId,
        kycStatus: data.getVerificationLinkByToken.kycVerification?.status,
        hasKycVerification: !!data.getVerificationLinkByToken.kycVerification
      });
      
      // Verificar si el enlace es válido
      const linkStatus = data.getVerificationLinkByToken.status;
      // Permitir estados 'active', 'accepted', 'rejected', 'facetec_completed', 'contact_submitted', 'verification_completed' durante la sesión
      const validStatuses = ['active', 'accepted', 'rejected', 'facetec_completed', 'contact_submitted', 'verification_completed'];
      if (!validStatuses.includes(linkStatus)) {
        setError('Este enlace ha expirado o ha sido invalidado');
        setEnlaceExpirado(true);
        return;
      } else {
        // Verificar si se deben saltar los términos y condiciones
        const skipTerms = process.env.NEXT_PUBLIC_SKIP_TERMS_AND_CONDITIONS === 'true';
        console.log('Skip terms environment variable:', skipTerms);
        
        // Establecer el paso según el estado del enlace
        if (linkStatus === 'accepted') {
          // Si el enlace está aceptado, verificar si se requiere formulario de contacto
          if (flowServiceInitialized && flowSettings?.isContactFormRequired) {
            // Si se requiere formulario de contacto y el estado ya está en contact_submitted, mostrar FaceTec
            if (linkStatus === 'contact_submitted') {
              setContactInfoSubmitted(true);
              setStep('verificacion');
            } else {
              // Si no, mostrar el formulario de contacto
              setStep('contacto');
            }
          } else {
            // Si no se requiere formulario, ir directamente a FaceTec
            setStep('verificacion');
          }
        } else if (linkStatus === 'rejected') {
          setStep('rechazo');
        } else if (linkStatus === 'facetec_completed') {
          setStep('completado');
        } else if (linkStatus === 'contact_submitted') {
          setContactInfoSubmitted(true);
          setStep('verificacion');
        } else if (linkStatus === 'verification_completed') {
          setStep('completado');
        } else if (linkStatus === 'active' && skipTerms) {
          // Si se deben saltar los términos y condiciones, aceptar automáticamente
          console.log('Saltando términos y condiciones automáticamente...');
          handleAceptarTerminos();
        }
      }
      
      // Verificar si la verificación KYC es válida
      if (!data.getVerificationLinkByToken.kycVerification) {
        setError('No se encontró la verificación asociada a este enlace');
        return;
      }
    }
  }, [token, loading, data, flowServiceInitialized, flowSettings]);

  const handleAceptarTerminos = () => {
    if (token && data?.getVerificationLinkByToken?.verificationId) {
      const verificationId = data.getVerificationLinkByToken.verificationId;
      
      // Utilizar el hook para actualizar los estados
      acceptTerms(token, verificationId)
        .then(response => {
          if (response.verificationLinkSuccess) {
            console.log('Estado del enlace actualizado a accepted');
            
            // Verificar si se requiere formulario de contacto según el nivel
            if (flowServiceInitialized && flowSettings?.isContactFormRequired) {
              console.log('Se requiere formulario de contacto antes de FaceTec, mostrando formulario...');
              setStep('contacto');
            } else {
              // Si no se requiere formulario, ir directamente a FaceTec
              console.log('No se requiere formulario de contacto, continuando con FaceTec...');
              setStep('verificacion');
            }
          } else {
            setError('Error al actualizar el estado del enlace');
          }
        })
        .catch(error => {
          console.error('Error al aceptar términos:', error);
          setError('Error al aceptar los términos: ' + (error instanceof Error ? error.message : 'Error desconocido'));
        });
    } else {
      setError('No se pudo determinar el ID de verificación');
    }
  };

  const handleRechazarTerminos = () => {
    if (token && data?.getVerificationLinkByToken?.verificationId) {
      const verificationId = data.getVerificationLinkByToken.verificationId;
      
      // Utilizar el hook para actualizar los estados
      rejectTerms(token, verificationId)
        .then(response => {
          if (response.verificationLinkSuccess) {
            console.log('Estado del enlace actualizado a rejected');
            // Mostrar la pantalla de rechazo
            setStep('rechazo');
          } else {
            setError('Error al actualizar el estado del enlace');
          }
        })
        .catch(error => {
          console.error('Error al rechazar términos:', error);
          setError('Error al rechazar los términos: ' + (error instanceof Error ? error.message : 'Error desconocido'));
          // A pesar del error, mostramos la pantalla de rechazo
          setStep('rechazo');
        });
    } else {
      setError('No se pudo determinar el ID de verificación');
      // A pesar del error, mostramos la pantalla de rechazo
      setStep('rechazo');
    }
  };


  const handleVerificationComplete = (faceTecSessionId: string, documentImages: string[]) => {
    if (!data?.getVerificationLinkByToken?.verificationId) {
      setError('No se pudo determinar el ID de verificación');
      return;
    }
    
    const verificationId = data.getVerificationLinkByToken.verificationId;
    
    console.log('FaceTec completado, actualizando estado...', {
      verificationType: ClientVerificationFlowService.getVerificationType(),
      token: token?.substring(0, 8) + '...',
      documentImagesCount: documentImages?.length || 0
    });
    
    // Verificar si el servicio de flujo está inicializado
    if (!ClientVerificationFlowService.isInitialized()) {
      console.log('ADVERTENCIA: Servicio de flujo no inicializado, intentando inicializar...');
      
      // Intentar inicializar el servicio con los datos del token si están disponibles
      const verificationType = data?.getVerificationLinkByToken?.kycVerification?.verificationType;
      
      if (verificationType) {
        ClientVerificationFlowService.initialize(verificationType);
        console.log(`Servicio inicializado tardíamente con tipo: ${verificationType}`);
      } else {
        console.warn('No se pudo determinar el tipo de verificación, procediendo con precaución');
      }
    }
    
    // Obtener información del tipo de verificación desde el servicio centralizado
    const isBronzeVerification = ClientVerificationFlowService.isBronzeVerification();
    const isGoldVerification = ClientVerificationFlowService.isGoldVerification();
    const requiresCurpValidation = ClientVerificationFlowService.isCURPValidationRequired();
    const requiresIneValidation = ClientVerificationFlowService.isINEValidationRequired();
    
    console.log('Información del tipo de verificación (desde servicio):', {
      isBronze: isBronzeVerification,
      isGold: isGoldVerification,
      requiresCurp: requiresCurpValidation,
      requiresIne: requiresIneValidation,
      nextStep: ClientVerificationFlowService.getNextStepAfterFaceTec()
    });
    
    // Verificar si necesitamos obtener FaceTecResult para validaciones adicionales
    const forceGetFaceTecResults = true; // Cambiar a false cuando todo funcione correctamente
    
    if (ClientVerificationFlowService.isCURPValidationRequired() || 
        ClientVerificationFlowService.isINEValidationRequired() || 
        forceGetFaceTecResults) {
      console.log('Obteniendo FaceTecResult para validaciones adicionales');
      
      // Utilizamos la query a través de Apollo hooks para mantener la integración con React
      getFacetecResults({
        variables: { verificationId }
      });
    }
    
    // Para Bronze, actualizar directamente a verification_completed
    if (isBronzeVerification && token) {
      console.log('Verificación Bronze detectada, saltando a verification_completed');
      completeVerification(token, verificationId)
        .then(response => {
          if (response.verificationLinkSuccess) {
            console.log('Estado actualizado a verification_completed correctamente');
            setStep('completado');
          } else {
            console.error('Error al actualizar estado:', response.verificationLinkError);
            setError('Error al actualizar el estado: ' + response.verificationLinkError);
          }
        })
        .catch(error => {
          console.error('Error al completar verificación:', error);
          setError('Error al actualizar el estado: ' + (error instanceof Error ? error.message : 'Error desconocido'));
        });
      return;
    }
    
    // Para Silver y Gold, continuar con el flujo normal
    // Actualiza el estado a facetec_completed y luego a verification_completed
    if (token) {
      completeFaceTec(token, verificationId)
        .then(response => {
          if (response.verificationLinkSuccess) {
            console.log('Estado actualizado a facetec_completed correctamente');
            
            // Luego ejecuta el procesamiento adicional según el nivel de verificación
            if (flowSettings && flowSettings.isTimestampSealingRequired && documentImages?.length > 0) {
              console.log('Requiere sellado de tiempo, procesando imágenes...');
              // Sanitizar imágenes para evitar problemas
              const sanitizedImages = documentImages
                .filter(img => typeof img === 'string' && img.length > 0)
                .map(img => img.substring(0, 50000)); // Limitar tamaño si necesario
                
              processFaceTecCompletion({
                variables: {
                  verificationId: data.getVerificationLinkByToken.verificationId,
                  faceTecSessionId: faceTecSessionId || 'unknown-session',
                  documentImages: sanitizedImages
                },
                onCompleted: (result) => {
                  console.log('Procesamiento FaceTec completado:', result);
                  handleVerificationCompleted();
                },
                onError: (error) => {
                  console.error('Error en procesamiento FaceTec (continuando):', error);
                  // A pesar del error, continuamos con el flujo
                  handleVerificationCompleted();
                }
              });
            } else {
              console.log('No requiere procesamiento adicional, completando verificación...');
              handleVerificationCompleted();
            }
          } else {
            console.error('Error al actualizar estado:', response.verificationLinkError);
            setError('Error al actualizar el estado: ' + response.verificationLinkError);
            // A pesar del error, intentamos continuar
            handleVerificationCompleted();
          }
        })
        .catch(error => {
          console.error('Error al actualizar estado a facetec_completed:', error);
          setError('Error al actualizar el estado: ' + (error instanceof Error ? error.message : 'Error desconocido'));
          // A pesar del error, intentamos continuar
          handleVerificationCompleted();
        });
    }
  };
  
  const handleShowContactForm = () => {
    // Ya no necesitamos actualizar a facetec_completed aquí
    // porque lo hacemos en handleVerificationComplete
    setStep('contacto');
  };
  
  const handleVerificationCompleted = async () => {
    // Actualizar el estado del enlace a "verification_completed"
    if (token && data?.getVerificationLinkByToken?.verificationId) {
      const verificationId = data.getVerificationLinkByToken.verificationId;
      
      try {
        const completionResponse = await completeVerification(token, verificationId);
        if (completionResponse.verificationLinkSuccess) {
          console.log('Estado actualizado a verification_completed correctamente');
        } else {
          console.error('Error al actualizar estado:', completionResponse.verificationLinkError);
        }
      } catch (error) {
        console.error('Error al completar verificación:', error);
      }
    }
    
    // Verificar si existe redirectUrl de la compañía para redirección automática
    const redirectUrl = data?.getVerificationLinkByToken?.kycVerification?.company?.redirectUrl;
    
    if (redirectUrl) {
      console.log('redirectUrl encontrado, redirigiendo a:', redirectUrl);
      // Dar tiempo para que se complete el procesamiento y luego redireccionar
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000); // Esperar 2 segundos para mostrar la confirmación antes de redireccionar
    }
    
    // Mostrar pantalla de verificación completada
    setStep('completado');
  };

  const handleContactSubmit = (email: string, phone: string) => {
    console.log('Contact info submitted:', email, phone);
    
    if (token && data?.getVerificationLinkByToken?.verificationId) {
      const verificationId = data.getVerificationLinkByToken.verificationId;
      
      // Marcar que el formulario de contacto se ha enviado
      setContactInfoSubmitted(true);
      
      // Actualizar el estado a contact_submitted y continuar con FaceTec
      // Aquí deberías crear/usar una mutación para actualizar el estado a contact_submitted
      // Por ahora pasamos directamente a la verificación
      setStep('verificacion');
    } else {
      // En caso de error, intentamos continuar con la verificación
      setStep('verificacion');
    }
  };

  // Loading state
  if (loading) {
    return <LoadingScreen message="Cargando..." />;
  }

  if (!data?.getVerificationLinkByToken) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-xl text-red-600">No se encontró el enlace de verificación</div>
      </div>
    );
  }

  // Si el enlace ha expirado, mostrar la pantalla de enlace expirado
  if (enlaceExpirado) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <EnlaceExpirado />
      </div>
    );
  }

  if (!data.getVerificationLinkByToken.kycVerification) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-xl text-red-600">No se encontró la verificación asociada a este enlace</div>
      </div>
    );
  }

  const { kycVerification } = data.getVerificationLinkByToken;
  const companyName = kycVerification.company?.companyName || '';
  const firstName = kycVerification.kycPerson?.firstName || '';
  const secondName = kycVerification.kycPerson?.secondName || '';
  const secondLastName = kycVerification.kycPerson?.secondLastName || '';
  const lastName = kycVerification.kycPerson?.lastName || '';
  const fullName = `${firstName} ${secondName} ${lastName} ${secondLastName}`.trim();
  const verificationType = kycVerification.verificationType || 'bronze';
  const redirectUrl = kycVerification.company?.redirectUrl;
  
  // Imprimir el nombre completo desde la query
  console.log('👤 Nombre completo desde query:', fullName);

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative">
      {/* Overlay de carga con transición suave */}
      <div 
        className={`fixed inset-0 bg-gray-50 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
          isProcessing ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <LoadingScreen />
      </div>

      {/* FaceTec component */}
      <div style={{ display: step === 'verificacion' ? 'block' : 'none' }}>
        <FaceTecComponent
          ref={faceTecRef}
          shouldStartVerification={step === 'verificacion'}
          onComplete={handleVerificationComplete}
          token={token || undefined}
        />
      </div>

      {/* Terms and conditions */}
      {step === 'terminos' && (
        <TerminosCondiciones
          onAceptar={handleAceptarTerminos}
          onRechazar={handleRechazarTerminos}
          companyName={companyName}
          firstName={firstName}
          redirectUrl={redirectUrl}
        />
      )}

      {/* Contact form - shown BEFORE FaceTec for silver and gold tiers */}
      {step === 'contacto' && token && (
        <div className="max-w-md mx-auto">
          <ContactForm 
            token={token} 
            onSubmit={handleContactSubmit}
            initialEmail={data.getVerificationLinkByToken.kycVerification?.kycPerson?.email || undefined}
            initialPhone={data.getVerificationLinkByToken.kycVerification?.kycPerson?.phone || undefined}
          />
        </div>
      )}

      {/* Verification completed */}
      {step === 'completado' && (
        <div className="max-w-md mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Verificación Completa!</h2>
            <p className="text-gray-600 mb-4">
              Tu proceso de verificación ha sido completado exitosamente.
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Nivel de verificación: <span className="font-semibold">{verificationType.toUpperCase()}</span>
            </p>
            {redirectUrl && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-center mb-2">
                  <Icons.spinner className="h-4 w-4 text-blue-500 animate-spin mr-2" />
                  <span className="text-blue-700 font-medium">Redirigiendo automáticamente...</span>
                </div>
                <p className="text-blue-600 text-sm">
                  Te redirigiremos automáticamente en unos segundos.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rejection screen */}
      {step === 'rechazo' && (
        <RechazoTerminos />
      )}
    </div>
  );
};

const FaceTecPage: React.FC = () => {
  return (
    <ApolloProvider client={publicClient}>
      <Suspense fallback={<LoadingScreen message="Cargando página..." />}>
        <FaceTecContent />
      </Suspense>
    </ApolloProvider>
  );
};

export default FaceTecPage;