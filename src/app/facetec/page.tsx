"use client"
import React, { useState, useRef, useEffect } from "react";
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
        }
        kycPerson {
          firstName
          lastName
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

// Mutación para actualizar el estado del enlace
const UPDATE_VERIFICATION_LINK_STATUS = gql`
  mutation UpdateVerificationLinkStatus($token: String!, $status: String!) {
    updateVerificationLinkStatus(token: $token, status: $status) {
      id
      status
      updatedAt
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
  
  // Incorporar el hook de validación de CURP con datos adicionales
  const { 
    isValidating, 
    isSaving,
    validationResult, 
    savedVerificationId,
    error: curpValidationError,
    validateCurpFromPersonalData 
  } = useCurpValidation();

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
  
  // Depuración para verificar IDs disponibles
  useEffect(() => {
    if (data?.getVerificationLinkByToken) {
      console.log('🔍 Información de verificación disponible:', {
        verificationIdFromLink: data.getVerificationLinkByToken.verificationId,
        verificationLinkId: data.getVerificationLinkByToken.id,
        kycVerificationId: data.getVerificationLinkByToken.kycVerification?.id
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
              setExtractedPersonalData(personalData);
              
              // Verificar si la validación CURP es requerida usando el servicio centralizado
              if (ClientVerificationFlowService.isCURPValidationRequired()) {
                console.log('Validación CURP requerida por el flujo de verificación');
                
                // Validar CURP utilizando el hook y guardar el resultado
                try {
                  // Obtener el ID de verificación
                  const verificationId = latestResult.verificationId || 
                                         data.getFacetecResultsByVerificationId[0].verificationId ||
                                         verificationIdFromQuery ||
                                         data?.getVerificationLinkByToken?.verificationId;
                  
                  console.log('Usando verificationId para guardar resultado:', verificationId);
                  
                  if (!verificationId) {
                    console.error('No se pudo determinar el ID de verificación. Datos disponibles:', {
                      latestResultId: latestResult.verificationId,
                      facetecResultsId: data.getFacetecResultsByVerificationId[0]?.verificationId,
                      verificationIdFromQuery,
                      verificationLinkId: data?.getVerificationLinkByToken?.verificationId
                    });
                    
                    console.warn('⚠️ Se continuará con la validación de CURP pero no se guardará el resultado');
                  }
                  
                  // Llamar a la validación con la opción de guardar el resultado solo si tenemos ID
                  // La validación CURP se guardará como una verificación externa de tipo IDENTITY
                  const shouldSave = Boolean(verificationId);
                  
                  try {
                    const result = await validateCurpFromPersonalData(personalData, token || null, {
                      verificationId,
                      saveResult: shouldSave
                    });
                    
                    if (shouldSave) {
                      console.log('Validación de CURP completada', 
                        savedVerificationId ? `y guardada con ID: ${savedVerificationId}` : 'pero no se guardó el resultado'
                      );
                    } else {
                      console.log('Validación de CURP completada pero no se guardó por falta de ID de verificación');
                    }
                    
                    // Imprimir el resultado de la validación para referencia
                    console.log('Resultado de validación CURP:', result.success ? 'Exitoso' : 'Fallido');
                  } catch (validationError) {
                    console.error('Error durante la validación o guardado de CURP:', validationError);
                    
                    // Intentar validar sin guardar como fallback
                    if (shouldSave) {
                      console.log('Intentando validar CURP sin guardar como fallback...');
                      try {
                        const resultWithoutSaving = await validateCurpFromPersonalData(personalData, token || null, {
                          saveResult: false
                        });
                        console.log('Validación de CURP sin guardado completada:', 
                          resultWithoutSaving.success ? 'Exitoso' : 'Fallido'
                        );
                      } catch (fallbackError) {
                        console.error('Error incluso en validación de fallback:', fallbackError);
                      }
                    }
                  }
                } catch (error) {
                  console.error('Error durante la validación de CURP:', error);
                }
              } else {
                console.log('Validación de CURP no requerida para este flujo');
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

  const [updateStatus] = useMutation(UPDATE_VERIFICATION_LINK_STATUS, {
    onCompleted: (data) => {
      console.log('Estado actualizado:', data);
    },
    onError: (error) => {
      console.error('Error al actualizar estado:', error);
      setError('Error al actualizar el estado: ' + error.message);
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
        // Establecer el paso según el estado del enlace
        if (linkStatus === 'accepted') {
          setStep('verificacion');
        } else if (linkStatus === 'rejected') {
          setStep('rechazo');
        } else if (linkStatus === 'facetec_completed') {
          setStep('contacto');
        } else if (linkStatus === 'contact_submitted' || linkStatus === 'verification_completed') {
          setStep('completado');
        }
      }
      
      // Verificar si la verificación KYC es válida
      if (!data.getVerificationLinkByToken.kycVerification) {
        setError('No se encontró la verificación asociada a este enlace');
        return;
      }
      
      const kycStatus = data.getVerificationLinkByToken.kycVerification.status;
      if (kycStatus !== 'pending') {
        setError('Esta verificación ya no está pendiente');
      }
    }
  }, [token, loading, data]);

  const handleAceptarTerminos = () => {
    if (token) {
      // Actualizar estado a "accepted"
      updateStatus({ 
        variables: { 
          token,
          status: 'accepted'
        }
      });
      
      // Continuar con el proceso de verificación
      setStep('verificacion');
    }
  };

  const handleRechazarTerminos = () => {
    if (token) {
      // Actualizar estado a "rejected"
      updateStatus({ 
        variables: { 
          token, 
          status: 'rejected'
        }
      });
    }
    
    // Mostrar la pantalla de rechazo
    setStep('rechazo');
  };

  const handleError = (error: string) => {
    setError(error);
    console.error('Error en la verificación:', error);
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
    
    console.log('Información del tipo de verificación (desde servicio):', {
      isBronze: isBronzeVerification,
      isGold: isGoldVerification,
      requiresCurp: requiresCurpValidation,
      nextStep: ClientVerificationFlowService.getNextStepAfterFaceTec()
    });
    
    // Verificar si necesitamos obtener FaceTecResult para validaciones adicionales
    const forceGetFaceTecResults = true; // Cambiar a false cuando todo funcione correctamente
    
    if (ClientVerificationFlowService.isCURPValidationRequired() || forceGetFaceTecResults) {
      console.log('Obteniendo FaceTecResult para validación CURP o validación adicional');
      
      // Utilizamos la query a través de Apollo hooks para mantener la integración con React
      getFacetecResults({
        variables: { verificationId }
      });
    }
    
    // Para Bronze, actualizar directamente a verification_completed
    if (isBronzeVerification && token) {
      console.log('Verificación Bronze detectada, saltando a verification_completed');
      updateStatus({ 
        variables: { 
          token,
          status: 'verification_completed'
        }
      })
      .then(() => {
        console.log('Estado actualizado a verification_completed correctamente');
        setStep('completado');
      })
      .catch(error => {
        console.error('Error al actualizar estado:', error);
        setError('Error al actualizar el estado: ' + error.message);
      });
      return;
    }
    
    // Para Silver y Gold, continuar con el flujo normal
    // Primero actualiza el estado a facetec_completed
    if (token) {
      updateStatus({ 
        variables: { 
          token,
          status: 'facetec_completed'
        }
      })
      .then(() => {
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
              continueToNextStep();
            },
            onError: (error) => {
              console.error('Error en procesamiento FaceTec (continuando):', error);
              // A pesar del error, continuamos con el flujo
              continueToNextStep();
            }
          });
        } else {
          console.log('No requiere procesamiento adicional, continuando...');
          continueToNextStep();
        }
      })
      .catch(error => {
        console.error('Error al actualizar estado:', error);
        setError('Error al actualizar el estado: ' + error.message);
      });
    }
    
    // Función para continuar al siguiente paso según tipo de verificación
    function continueToNextStep() {
      console.log('Determinando el siguiente paso basado en el servicio de verificación');
      
      // Obtener el siguiente paso del servicio centralizado
      const nextStep = ClientVerificationFlowService.getNextStepAfterFaceTec();
      const isBronze = ClientVerificationFlowService.isBronzeVerification();
      
      console.log('Información de flujo (desde servicio):', {
        nextStep,
        isBronze,
        requiresContactForm: ClientVerificationFlowService.isContactFormRequired()
      });
      
      // Para bronze o cuando el siguiente paso es 'complete', saltar directamente a completado
      if (isBronze || nextStep === 'complete') {
        console.log('Verificación Bronze o flujo completo, finalizando verificación');
        handleVerificationCompleted();
      } else {
        console.log('Siguiente paso: formulario de contacto');
        setStep('contacto');
      }
    }
  };
  
  const handleShowContactForm = () => {
    // Ya no necesitamos actualizar a facetec_completed aquí
    // porque lo hacemos en handleVerificationComplete
    setStep('contacto');
  };
  
  const handleVerificationCompleted = () => {
    // Actualizar el estado del enlace a "verification_completed"
    if (token) {
      updateStatus({ 
        variables: { 
          token,
          status: 'verification_completed'
        }
      });
    }
    
    // Mostrar pantalla de verificación completada
    setStep('completado');
  };

  const handleContactSubmit = (email: string, phone: string) => {
    console.log('Contact info submitted:', email, phone);
    
    // Actualizar el estado a verification_completed
    if (token) {
      updateStatus({ 
        variables: { 
          token,
          status: 'verification_completed'
        }
      })
      .then(() => {
        console.log('Estado actualizado a verification_completed correctamente');
        setStep('completado');
      })
      .catch(error => {
        console.error('Error al actualizar estado a verification_completed:', error);
        // A pesar del error, mostramos la pantalla de completado
        setStep('completado');
      });
    } else {
      setStep('completado');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
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
  const verificationType = kycVerification.verificationType || 'bronze';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {(error || curpValidationError) && !enlaceExpirado && (
        <div className="max-w-4xl mx-auto mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error || curpValidationError}
        </div>
      )}

      {/* FaceTec component */}
      <div style={{ display: step === 'verificacion' ? 'block' : 'none' }}>
        <FaceTecComponent
          onError={handleError}
          ref={faceTecRef}
          shouldStartVerification={step === 'verificacion'}
          onComplete={handleVerificationComplete}
          token={token || undefined}
        />
      </div>

      {/* Mostrar indicador de validación de CURP si está en proceso */}
      {isValidating && (
        <div className="max-w-md mx-auto mb-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded">
          Validando CURP y datos personales...
        </div>
      )}

      {/* Mostrar indicador de guardado de resultados */}
      {isSaving && (
        <div className="max-w-md mx-auto mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded">
          Guardando resultados de validación CURP...
        </div>
      )}

      {/* Mostrar confirmación de guardado exitoso */}
      {savedVerificationId && (
        <div className="max-w-md mx-auto mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
          <p>Resultados de validación CURP guardados exitosamente</p>
          <p className="text-xs mt-1">ID: {savedVerificationId}</p>
        </div>
      )}

      {/* Terms and conditions */}
      {step === 'terminos' && (
        <TerminosCondiciones
          onAceptar={handleAceptarTerminos}
          onRechazar={handleRechazarTerminos}
          companyName={companyName}
          firstName={firstName}
        />
      )}

      {/* Contact form - only shown for silver and gold tiers */}
      {step === 'contacto' && token && (
        <div className="max-w-md mx-auto">
          <ContactForm 
            token={token} 
            onSubmit={handleContactSubmit} 
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
            <p className="text-gray-500 text-sm">
              Nivel de verificación: <span className="font-semibold">{verificationType.toUpperCase()}</span>
            </p>
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
      <FaceTecContent />
    </ApolloProvider>
  );
};

export default FaceTecPage;