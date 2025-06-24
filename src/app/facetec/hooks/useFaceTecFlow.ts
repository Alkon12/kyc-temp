import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useVerificationStatus } from '@/hooks/useVerificationStatus';
import { useDocumentSigning } from '@/hooks';
import { GET_VERIFICATION_BY_TOKEN, RECORD_VERIFICATION_LINK_ACCESS, PROCESS_FACETEC_COMPLETION } from '../graphql/queries';
import ClientVerificationFlowService from '@/services/ClientVerificationFlowService';

type StepType = 'terminos' | 'verificacion' | 'rechazo' | 'contacto' | 'completado';

interface UseFaceTecFlowProps {
  token: string | null;
}

export const useFaceTecFlow = ({ token }: UseFaceTecFlowProps) => {
  const [step, setStep] = useState<StepType>('terminos');
  const [error, setError] = useState<string | null>(null);
  const [enlaceExpirado, setEnlaceExpirado] = useState(false);
  const [accessRecorded, setAccessRecorded] = useState(false);
  const [contactInfoSubmitted, setContactInfoSubmitted] = useState(false);

  // Usar el hook de verificación de estados
  const { 
    isUpdating: isStatusUpdating,
    error: statusUpdateError,
    acceptTerms,
    rejectTerms,
    completeFaceTec,
    completeVerification
  } = useVerificationStatus();

  // Hook de documento para firma
  const {
    isLoading: isDocumentLoading,
    error: documentError,
    getDocumentsToSign,
    sendDocumentForSigning
  } = useDocumentSigning();

  // Query para obtener datos de verificación
  const { loading, data, error: queryError } = useQuery(GET_VERIFICATION_BY_TOKEN, {
    variables: { token },
    skip: !token,
  });

  // Mutations
  const [recordAccess] = useMutation(RECORD_VERIFICATION_LINK_ACCESS, {
    onCompleted: (data) => {
      console.log('Acceso registrado:', data);
      setAccessRecorded(true);
    },
    onError: (error) => {
      console.error('Error al registrar acceso:', error);
    }
  });

  const [processFaceTecCompletion] = useMutation(PROCESS_FACETEC_COMPLETION, {
    onCompleted: (data) => {
      console.log('FaceTec processed:', data);
      if (data.processFaceTecCompletion.success) {
        handleVerificationCompleted();
      } else {
        setError(data.processFaceTecCompletion.error || 'Error processing FaceTec completion');
      }
    },
    onError: (error) => {
      console.error('Error processing FaceTec completion:', error);
      setError(error.message);
    }
  });

  // Registrar el acceso cuando se carga la página
  useEffect(() => {
    if (token && !accessRecorded) {
      recordAccess({ variables: { token } });
    }
  }, [token, recordAccess, accessRecorded]);

  // Manejar errores de GraphQL
  useEffect(() => {
    if (queryError) {
      console.error('GraphQL Error:', queryError);
      setError(queryError.message);
    }
  }, [queryError]);

  // Manejar errores de actualización de estado
  useEffect(() => {
    if (statusUpdateError) {
      setError(statusUpdateError);
    }
  }, [statusUpdateError]);

  // Validación de token y configuración inicial
  useEffect(() => {
    if (token && !loading && data?.getVerificationLinkByToken) {
      console.log('Validation data:', {
        linkStatus: data.getVerificationLinkByToken.status,
        verificationId: data.getVerificationLinkByToken.verificationId,
        kycStatus: data.getVerificationLinkByToken.kycVerification?.status,
        hasKycVerification: !!data.getVerificationLinkByToken.kycVerification
      });
      
      validateTokenAndSetInitialStep();
    }
  }, [token, loading, data]);

  const validateTokenAndSetInitialStep = () => {
    if (!data?.getVerificationLinkByToken) return;

    const linkStatus = data.getVerificationLinkByToken.status;
    const validStatuses = ['active', 'accepted', 'rejected', 'facetec_completed', 'contact_submitted', 'verification_completed'];
    
    if (!validStatuses.includes(linkStatus)) {
      setError('Este enlace ha expirado o ha sido invalidado');
      setEnlaceExpirado(true);
      return;
    }

    // Verificar si la verificación KYC es válida
    if (!data.getVerificationLinkByToken.kycVerification) {
      setError('No se encontró la verificación asociada a este enlace');
      return;
    }

    handleSkipTermsOrSetStep(linkStatus);
  };

  const handleSkipTermsOrSetStep = (linkStatus: string) => {
    const skipTerms = process.env.NEXT_PUBLIC_SKIP_TERMS_AND_CONDITIONS === 'true';
    
    if (skipTerms && linkStatus === 'active') {
      console.log('⚠️ MODO DESARROLLO: Saltando términos y condiciones automáticamente');
      autoAcceptTerms();
      return;
    }
    
    setStepBasedOnStatus(linkStatus);
  };

  const setStepBasedOnStatus = (linkStatus: string) => {
    switch (linkStatus) {
      case 'accepted':
        // Verificar si se requiere formulario de contacto
        if (ClientVerificationFlowService.isContactFormRequired()) {
          setStep('contacto');
        } else {
          setStep('verificacion');
        }
        break;
      case 'rejected':
        setStep('rechazo');
        break;
      case 'facetec_completed':
        setStep('completado');
        break;
      case 'contact_submitted':
        setContactInfoSubmitted(true);
        setStep('verificacion');
        break;
      case 'verification_completed':
        setStep('completado');
        break;
      default:
        setStep('terminos');
    }
  };

  const autoAcceptTerms = () => {
    const verificationId = data?.getVerificationLinkByToken?.verificationId;
    if (!verificationId) {
      console.error('No se pudo determinar el ID de verificación para auto-aceptar términos');
      setStep('terminos');
      return;
    }

    acceptTerms(token!, verificationId)
      .then(response => {
        if (response.verificationLinkSuccess) {
          console.log('Términos aceptados automáticamente');
          
          if (ClientVerificationFlowService.isContactFormRequired()) {
            setStep('contacto');
          } else {
            setStep('verificacion');
          }
        } else {
          console.error('Error al auto-aceptar términos, mostrando pantalla de términos');
          setStep('terminos');
        }
      })
      .catch(error => {
        console.error('Error al auto-aceptar términos:', error);
        setStep('terminos');
      });
  };

  // Handlers de eventos
  const handleAceptarTerminos = () => {
    if (!token || !data?.getVerificationLinkByToken?.verificationId) {
      setError('No se pudo determinar el ID de verificación');
      return;
    }

    const verificationId = data.getVerificationLinkByToken.verificationId;
    
    acceptTerms(token, verificationId)
      .then(response => {
        if (response.verificationLinkSuccess) {
          console.log('Estado del enlace actualizado a accepted');
          
          if (ClientVerificationFlowService.isContactFormRequired()) {
            setStep('contacto');
          } else {
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
  };

  const handleRechazarTerminos = () => {
    if (!token || !data?.getVerificationLinkByToken?.verificationId) {
      setError('No se pudo determinar el ID de verificación');
      setStep('rechazo');
      return;
    }

    const verificationId = data.getVerificationLinkByToken.verificationId;
    
    rejectTerms(token, verificationId)
      .then(response => {
        if (response.verificationLinkSuccess) {
          console.log('Estado del enlace actualizado a rejected');
          setStep('rechazo');
        } else {
          setError('Error al actualizar el estado del enlace');
          setStep('rechazo');
        }
      })
      .catch(error => {
        console.error('Error al rechazar términos:', error);
        setError('Error al rechazar los términos: ' + (error instanceof Error ? error.message : 'Error desconocido'));
        setStep('rechazo');
      });
  };

  const handleContactSubmit = (email: string, phone: string) => {
    console.log('Contact info submitted:', email, phone);
    
    setContactInfoSubmitted(true);
    setStep('verificacion');
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
    
    // Para Bronze, ir directamente a verification_completed
    if (ClientVerificationFlowService.isBronzeVerification() && token) {
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
    if (token) {
      completeFaceTec(token, verificationId)
        .then(response => {
          if (response.verificationLinkSuccess) {
            console.log('Estado actualizado a facetec_completed correctamente');
            
            // Procesar sellado de tiempo si es necesario
            if (ClientVerificationFlowService.isTimestampSealingRequired() && documentImages?.length > 0) {
              console.log('Requiere sellado de tiempo, procesando imágenes...');
              const sanitizedImages = documentImages
                .filter(img => typeof img === 'string' && img.length > 0)
                .map(img => img.substring(0, 50000));
                
              processFaceTecCompletion({
                variables: {
                  verificationId,
                  faceTecSessionId: faceTecSessionId || 'unknown-session',
                  documentImages: sanitizedImages
                }
              });
            } else {
              handleVerificationCompleted();
            }
          } else {
            console.error('Error al actualizar estado:', response.verificationLinkError);
            setError('Error al actualizar el estado: ' + response.verificationLinkError);
            handleVerificationCompleted();
          }
        })
        .catch(error => {
          console.error('Error al actualizar estado a facetec_completed:', error);
          setError('Error al actualizar el estado: ' + (error instanceof Error ? error.message : 'Error desconocido'));
          handleVerificationCompleted();
        });
    }
  };

  const handleVerificationCompleted = async () => {
    if (!token || !data?.getVerificationLinkByToken?.verificationId) return;
    
    const verificationId = data.getVerificationLinkByToken.verificationId;
    
    try {
      const completionResponse = await completeVerification(token, verificationId);
      if (completionResponse.verificationLinkSuccess) {
        console.log('Estado actualizado a verification_completed correctamente');
        
        // Verificar si hay documentos para firmar
        await handleDocumentSigning(verificationId);
      } else {
        console.error('Error al actualizar estado:', completionResponse.verificationLinkError);
      }
    } catch (error) {
      console.error('Error al completar verificación:', error);
    }
    
    // Verificar redirección automática
    const redirectUrl = data?.getVerificationLinkByToken?.kycVerification?.company?.redirectUrl;
    if (redirectUrl) {
      console.log('redirectUrl encontrado, redirigiendo a:', redirectUrl);
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000);
    }
    
    setStep('completado');
  };

  const handleDocumentSigning = async (verificationId: string) => {
    try {
      console.log('Verificando documentos pendientes para firma...');
      const documents = await getDocumentsToSign(verificationId);
      
      if (documents && documents.length > 0) {
        console.log('Se encontraron documentos pendientes para firma:', documents);
        
        // Procesar cada documento
        for (const doc of documents) {
          try {
            if (!doc.templateId) {
              console.error(`El documento ${doc.documentId} no tiene un ID de plantilla válido`);
              continue;
            }
            
            const signingData: any = {};
            
            // Añadir datos si están disponibles
            const fullName = `${data?.getVerificationLinkByToken?.kycVerification?.kycPerson?.firstName || ''} ${data?.getVerificationLinkByToken?.kycVerification?.kycPerson?.lastName || ''}`.trim();
            if (fullName) {
              signingData.nombre = fullName;
            }
            
            const result = await sendDocumentForSigning(doc.documentId, signingData);
            console.log(`Documento ${doc.documentId} enviado correctamente:`, result);
          } catch (docError) {
            console.error(`Error al enviar documento ${doc.documentId}:`, docError);
          }
        }
      } else {
        console.log('No se encontraron documentos pendientes para firma');
      }
    } catch (documentsError) {
      console.error('Error al verificar documentos para firma:', documentsError);
    }
  };

  return {
    // State
    step,
    error,
    enlaceExpirado,
    contactInfoSubmitted,
    loading,
    data,
    isProcessing: isStatusUpdating || isDocumentLoading,

    // Actions
    setError,
    handleAceptarTerminos,
    handleRechazarTerminos,
    handleContactSubmit,
    handleVerificationComplete,

    // Computed values
    kycVerification: data?.getVerificationLinkByToken?.kycVerification,
    companyName: data?.getVerificationLinkByToken?.kycVerification?.company?.companyName || '',
    firstName: data?.getVerificationLinkByToken?.kycVerification?.kycPerson?.firstName || '',
    lastName: data?.getVerificationLinkByToken?.kycVerification?.kycPerson?.lastName || '',
    fullName: `${data?.getVerificationLinkByToken?.kycVerification?.kycPerson?.firstName || ''} ${data?.getVerificationLinkByToken?.kycVerification?.kycPerson?.lastName || ''}`.trim(),
    verificationType: data?.getVerificationLinkByToken?.kycVerification?.verificationType || 'bronze',
    redirectUrl: data?.getVerificationLinkByToken?.kycVerification?.company?.redirectUrl
  };
}; 