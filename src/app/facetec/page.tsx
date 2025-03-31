"use client"
import React, { useState, useRef, useEffect } from "react";
import TerminosCondiciones from "../components/kyc/TerminosCondiciones";
import FaceTecComponent from "../components/kyc/FaceTecComponent";
import RechazoTerminos from "../components/kyc/RechazoTerminos";
import EnlaceExpirado from "../components/kyc/EnlaceExpirado";
import ContactForm from "../components/kyc/ContactForm";
import { useSearchParams } from 'next/navigation';
import { gql, useQuery, useMutation, ApolloProvider } from '@apollo/client';
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

const FaceTecContent: React.FC = () => {
  const [step, setStep] = useState<'terminos' | 'verificacion' | 'rechazo' | 'contacto'>('terminos');
  const [error, setError] = useState<string | null>(null);
  const [enlaceExpirado, setEnlaceExpirado] = useState(false);
  const faceTecRef = useRef<any>(null);
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const [accessRecorded, setAccessRecorded] = useState(false);

  const { loading, data, error: queryError } = useQuery(GET_VERIFICATION_BY_TOKEN, {
    variables: { token },
    skip: !token,
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
      // Permitir estados 'active', 'accepted', 'rejected', 'facetec_completed', 'contact_submitted' durante la sesión
      const validStatuses = ['active', 'accepted', 'rejected', 'facetec_completed', 'contact_submitted'];
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
        } else if (linkStatus === 'contact_submitted') {
          setStep('contacto');
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

  const handleVerificationComplete = () => {
    // Actualizar el estado del enlace a "facetec_completed"
    if (token) {
      updateStatus({ 
        variables: { 
          token,
          status: 'facetec_completed'
        }
      });
    }
    
    // Mostrar el formulario de contacto
    setStep('contacto');
  };

  const handleContactSubmit = (email: string, phone: string) => {
    console.log('Contact info submitted:', email, phone);
    // You can add additional actions here after contact submission
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {error && !enlaceExpirado && (
        <div className="max-w-4xl mx-auto mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* FaceTec component */}
      <div style={{ display: step === 'verificacion' ? 'block' : 'none' }}>
        <FaceTecComponent
          onError={handleError}
          ref={faceTecRef}
          shouldStartVerification={step === 'verificacion'}
          onComplete={handleVerificationComplete}
        />
      </div>

      {/* Terms and conditions */}
      {step === 'terminos' && (
        <TerminosCondiciones
          onAceptar={handleAceptarTerminos}
          onRechazar={handleRechazarTerminos}
          companyName={companyName}
          firstName={firstName}
        />
      )}

      {/* Contact form */}
      {step === 'contacto' && token && (
        <div className="max-w-md mx-auto">
          <ContactForm 
            token={token} 
            onSubmit={handleContactSubmit} 
          />
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