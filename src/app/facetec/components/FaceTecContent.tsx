"use client"
import React, { useRef, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { useVerificationFlow } from '@/hooks/useVerificationFlow';
import TerminosCondiciones from "@/components/kyc/TerminosCondiciones";
import FaceTecComponent from "@/components/kyc/FaceTecComponent";
import RechazoTerminos from "@/components/kyc/RechazoTerminos";
import EnlaceExpirado from "@/components/kyc/EnlaceExpirado";
import ContactForm from "@/components/kyc/ContactForm";
import ClientVerificationFlowService from '@/services/ClientVerificationFlowService';
import { useFaceTecFlow } from '../hooks/useFaceTecFlow';
import { useFaceTecData } from '../hooks/useFaceTecData';
import { LoadingScreen } from './LoadingScreen';
import { CompletedScreen } from './CompletedScreen';
import { publicClient } from '../client/apolloClient';

export const FaceTecContent: React.FC = () => {
  const faceTecRef = useRef<any>(null);
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  // Configurar el servicio de flujo de verificación con el cliente Apollo
  useEffect(() => {
    ClientVerificationFlowService.setApolloClient(publicClient);
  }, []);

  // Hook principal del flujo de FaceTec
  const {
    step,
    error,
    enlaceExpirado,
    contactInfoSubmitted,
    loading,
    data,
    isProcessing,
    setError,
    handleAceptarTerminos,
    handleRechazarTerminos,
    handleContactSubmit,
    handleVerificationComplete,
    kycVerification,
    companyName,
    firstName,
    lastName,
    fullName,
    verificationType,
    redirectUrl
  } = useFaceTecFlow({ token: token || null });

  // Hook de verificación de flujo
  const verificationIdFromQuery = data?.getVerificationLinkByToken?.verificationId;
  const verificationTypeFromQuery = data?.getVerificationLinkByToken?.kycVerification?.verificationType;
  
  const { 
    flowServiceInitialized, 
    flowSettings, 
    error: flowError,
    setError: setFlowError
  } = useVerificationFlow(verificationIdFromQuery, verificationTypeFromQuery);

  // Hook de datos de FaceTec y validaciones
  const {
    extractedPersonalData,
    isProcessing: isDataProcessing,
    getFacetecResults,
    validationResults,
    validationErrors,
    savedVerificationIds
  } = useFaceTecData({
    verificationIdFromQuery,
    data,
    publicClient,
    firstName,
    lastName,
    token: token || undefined
  });

  // Sincronizar errores
  useEffect(() => {
    if (flowError) {
      setError(flowError);
    }
  }, [flowError, setError]);

  useEffect(() => {
    const hasValidationErrors = validationErrors.curp || 
                              validationErrors.fuzzy || 
                              validationErrors.listaNominal;
    if (hasValidationErrors) {
      // Solo mostrar errores críticos, no errores de validación normales
      console.log('Errores de validación detectados:', validationErrors);
    }
  }, [validationErrors]);

  // Depuración para verificar IDs disponibles
  useEffect(() => {
    if (data?.getVerificationLinkByToken) {
      console.log('🔍 Información de verificación disponible:', {
        verificationIdFromLink: data.getVerificationLinkByToken.verificationId,
        verificationLinkId: data.getVerificationLinkByToken.id,
        kycVerificationId: data.getVerificationLinkByToken.kycVerification?.id,
        redirectUrl: data.getVerificationLinkByToken.kycVerification?.company?.redirectUrl
      });
    }
  }, [data]);

  // Manejar la finalización de verificación con datos FaceTec
  const handleVerificationCompleteWithData = (faceTecSessionId: string, documentImages: string[]) => {
    console.log('FaceTec completado, obteniendo resultados para validaciones...');
    
    // Verificar si necesitamos obtener FaceTecResult para validaciones adicionales
    if (ClientVerificationFlowService.isCURPValidationRequired() || 
        ClientVerificationFlowService.isINEValidationRequired() || 
        ClientVerificationFlowService.isFuzzyValidationRequired()) {
      
      const verificationId = data?.getVerificationLinkByToken?.verificationId;
      if (verificationId) {
        console.log('Obteniendo FaceTecResult para validaciones adicionales');
        getFacetecResults({
          variables: { verificationId }
        });
      }
    }
    
    // Continuar con el flujo normal
    handleVerificationComplete(faceTecSessionId, documentImages);
  };

  // Determinar si está procesando
  const totalProcessing = loading || isProcessing || isDataProcessing;

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

  if (!kycVerification) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-xl text-red-600">No se encontró la verificación asociada a este enlace</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative">
      {/* Overlay de carga con transición suave */}
      <div 
        className={`fixed inset-0 bg-gray-50 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
          totalProcessing ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <LoadingScreen />
      </div>

      {/* Mensaje de error genérico */}
      {error && !enlaceExpirado && !totalProcessing && (
        <div className="max-w-4xl mx-auto mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.
        </div>
      )}

      {/* FaceTec component */}
      <div style={{ display: step === 'verificacion' ? 'block' : 'none' }}>
        <FaceTecComponent
          ref={faceTecRef}
          shouldStartVerification={step === 'verificacion'}
          onComplete={handleVerificationCompleteWithData}
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
            initialEmail={kycVerification?.kycPerson?.email || undefined}
            initialPhone={kycVerification?.kycPerson?.phone || undefined}
          />
        </div>
      )}

      {/* Verification completed */}
      {step === 'completado' && (
        <CompletedScreen 
          verificationType={verificationType}
          redirectUrl={redirectUrl}
        />
      )}

      {/* Rejection screen */}
      {step === 'rechazo' && (
        <RechazoTerminos />
      )}
    </div>
  );
}; 