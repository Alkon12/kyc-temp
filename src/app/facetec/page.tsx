"use client"
import React, { useState, useRef, useEffect } from "react";
import TerminosCondiciones from "../components/kyc/TerminosCondiciones";
import FaceTecComponent from "../components/kyc/FaceTecComponent";
import RechazoTerminos from "../components/kyc/RechazoTerminos";
import { useSearchParams } from 'next/navigation';
import { gql, useQuery, ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const GET_KYC_VERIFICATION = gql`
  query GetKycVerification($id: ID!) {
    kycVerification(id: $id) {
      id
      company {
        companyName
      }
      kycPerson {
        firstName
        lastName
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
  const id = searchParams?.get('id');

  const { loading, data, error: queryError } = useQuery(GET_KYC_VERIFICATION, {
    variables: { id },
    skip: !id,
  });

  useEffect(() => {
    if (queryError) {
      setError(queryError.message);
    }
  }, [queryError]);

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

  if (!data?.kycVerification) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-xl text-red-600">No se encontró la verificación</div>
      </div>
    );
  }

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
          companyName={data.kycVerification.company.companyName}
          firstName={data.kycVerification.kycPerson.firstName}
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