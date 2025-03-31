"use client"
import React, { useState, useRef, useEffect } from "react";
import TerminosCondiciones from "../components/kyc/TerminosCondiciones";
import FaceTecComponent from "../components/kyc/FaceTecComponent";
import RechazoTerminos from "../components/kyc/RechazoTerminos";
import { useSearchParams } from 'next/navigation';
import { gql, useQuery, ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

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

// Crear el cliente de Apollo para el endpoint público
const publicClient = new ApolloClient({
  link: createHttpLink({
    uri: '/api/public/graphql',
  }),
  cache: new InMemoryCache(),
});

const FaceTecContent: React.FC = () => {
  const [step, setStep] = useState<'terminos' | 'verificacion' | 'rechazo'>('terminos');
  const [error, setError] = useState<string | null>(null);
  const faceTecRef = useRef<any>(null);
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const { loading, data, error: queryError } = useQuery(GET_VERIFICATION_BY_TOKEN, {
    variables: { token },
    skip: !token,
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
      if (linkStatus !== 'active') {
        setError('Este enlace ha expirado o ha sido invalidado');
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
    setStep('verificacion');
  };

  const handleRechazarTerminos = () => {
    setStep('rechazo');
  };

  const handleError = (error: string) => {
    setError(error);
    console.error('Error en la verificación:', error);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {error && (
        <div className="max-w-4xl mx-auto mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* FaceTec siempre se monta pero oculto hasta que se acepten los términos */}
      <div style={{ display: step === 'verificacion' ? 'block' : 'none' }}>
        <FaceTecComponent
          onError={handleError}
          ref={faceTecRef}
          shouldStartVerification={step === 'verificacion'}
        />
      </div>

      {step === 'terminos' && (
        <TerminosCondiciones
          onAceptar={handleAceptarTerminos}
          onRechazar={handleRechazarTerminos}
          companyName={companyName}
          firstName={firstName}
        />
      )}

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