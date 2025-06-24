import { gql } from '@apollo/client';

// Consulta para obtener verificación usando token en lugar del ID
export const GET_VERIFICATION_BY_TOKEN = gql`
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
          firstName
          lastName
          email
          phone
        }
      }
    }
  }
`;

// Nueva consulta para obtener FaceTecResult por verification ID
export const GET_FACETEC_RESULTS = gql`
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
export const PROCESS_FACETEC_COMPLETION = gql`
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
export const RECORD_VERIFICATION_LINK_ACCESS = gql`
  mutation RecordVerificationLinkAccess($token: String!) {
    recordVerificationLinkAccess(token: $token) {
      id
      accessCount
      lastAccessedAt
    }
  }
`; 