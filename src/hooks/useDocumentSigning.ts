import { useState } from 'react';
import { gql, useMutation, useApolloClient } from '@apollo/client';

// GraphQL queries/mutations para interactuar con DocumentSigningService
const GET_DOCUMENTS_TO_SIGN = gql`
  query GetDocumentsToSign($verificationId: String!) {
    getDocumentsToSignByVerificationId(verificationId: $verificationId) {
      documentId
      templateId
      status
      signerEmail
      signerPhone
    }
  }
`;

const SEND_DOCUMENT_FOR_SIGNING = gql`
  mutation SendDocumentForSigning($documentId: String!, $data: JSON) {
    sendDocumentForSigning(documentId: $documentId, data: $data) {
      success
      message
      documentId
      submissionId
    }
  }
`;

/**
 * Hook personalizado para interactuar con DocumentSigningService
 */
export const useDocumentSigning = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const client = useApolloClient();

  // Mutación para enviar documentos para firma
  const [sendDocumentMutation] = useMutation(SEND_DOCUMENT_FOR_SIGNING, {
    onError: (error) => {
      console.error('Error en mutación sendDocumentForSigning:', error);
      setError(error.message);
    }
  });

  /**
   * Obtiene documentos pendientes de firma para una verificación
   */
  const getDocumentsToSign = async (verificationId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await client.query({
        query: GET_DOCUMENTS_TO_SIGN,
        variables: { verificationId },
        fetchPolicy: 'network-only' // Siempre obtener datos actualizados
      });
      
      return data.getDocumentsToSignByVerificationId || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener documentos';
      console.error('Error al obtener documentos pendientes:', err);
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Envía un documento para firma con datos prellenados opcional
   */
  const sendDocumentForSigning = async (documentId: string, data?: Record<string, string>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`[useDocumentSigning] Enviando documento ${documentId} para firma...`);
      console.log(`[useDocumentSigning] Datos para prellenar:`, data || 'No data');
      
      // Verificar que el ID del documento es válido
      if (!documentId || typeof documentId !== 'string' || documentId.trim() === '') {
        throw new Error('El ID del documento es inválido');
      }
      
      const result = await sendDocumentMutation({
        variables: {
          documentId,
          data: data || null
        }
      });
      
      const response = result.data?.sendDocumentForSigning;
      console.log(`[useDocumentSigning] Respuesta recibida:`, response);
      
      if (response && response.success) {
        console.log(`[useDocumentSigning] Documento enviado correctamente con submissionId: ${response.submissionId}`);
        return response;
      } else {
        const errorMessage = response?.message || 'Error desconocido al enviar documento';
        console.error(`[useDocumentSigning] Error en la respuesta:`, errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      let errorMessage = 'Error desconocido al enviar documento';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Identificar errores específicos para dar mensajes más útiles
        if (errorMessage.includes('404 Not Found') && errorMessage.includes('template')) {
          errorMessage = 'La plantilla asociada al documento no existe en Docuseal. Verifica que el ID de la plantilla sea correcto y que exista en Docuseal.';
        } else if (errorMessage.includes('401 Unauthorized')) {
          errorMessage = 'No tienes autorización para acceder a Docuseal. Verifica las credenciales (DOCUSEAL_TOKEN).';
        } else if (errorMessage.includes('Cannot read properties of undefined') || errorMessage.includes('null')) {
          errorMessage = 'Error al acceder a propiedades del documento o plantilla. Verifica que los datos estén completos.';
        }
      }
      
      console.error(`[useDocumentSigning] Error al enviar documento para firma:`, err);
      console.error(`[useDocumentSigning] Mensaje personalizado:`, errorMessage);
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    getDocumentsToSign,
    sendDocumentForSigning
  };
}; 