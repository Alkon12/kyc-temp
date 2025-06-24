import { gql } from '@apollo/client'
import { UUID } from 'crypto'

// Query to fetch all KYC verifications with related data
export const GET_KYC_VERIFICATIONS = gql`
  query KycVerificationsWithRelations {
    kycVerificationsWithRelations {
      id
      kycPersons {
        id
        firstName
        secondName
        lastName
        secondLastName
        curp
        email
        phone
        street
        colony
        city
        dateOfBirth
        nationality
        documentNumber
        documentType
      }
      status
      company {
        companyName
      }
      documents {
        fileName
      }
      externalVerifications {
        provider
        status
      }
      verificationLinks {
        lastAccessedAt
        status
      }
      notes
      verificationType
      updatedAt
    }
  }
`

// Query to fetch a specific KYC verification by ID with all relations
export const GET_KYC_VERIFICATION_BY_ID = gql`
  query GetKycVerificationWithRelationsById($id: ID!) {
    kycVerificationWithRelationsById(id: $id) {
      id
      kycPersons {
        id
        firstName
        secondName
        lastName
        secondLastName
        curp
        email
        phone
        street
        colony
        city
        dateOfBirth
        nationality
        documentNumber
        documentType
      }
      status
      company {
        companyName
      }
      documents {
        fileName
      }
      externalVerifications {
        id
        provider
        status
        requestData
        responseData
      }
      verificationLinks {
        lastAccessedAt
        status
        token
      }
      notes
      verificationType
      updatedAt
    }
  }
`

// Mutation para actualizar los datos de request de una verificación externa
export const UPDATE_EXTERNAL_VERIFICATION_REQUEST = gql`
  mutation UpdateExternalVerificationRequest($updateExternalVerificationRequestId: ID!, $requestData: JSON!) {
  updateExternalVerificationRequest(id: $updateExternalVerificationRequestId, requestData: $requestData)
  }
`
export const UPDATE_EXTERNAL_VERIFICATION_RESPONSE = gql`
  mutation UpdateExternalVerificationResponse($updateExternalVerificationResponseId: ID!, $responseData: JSON!) {
  updateExternalVerificationResponse(id: $updateExternalVerificationResponseId, responseData: $responseData)
  } 
`
export const UPDATE_EXTERNAL_VERIFICATION_STATUS = gql`
  mutation UpdateExternalVerificationStatus($updateExternalVerificationStatusId: ID!, $status: String!) {
  updateExternalVerificationStatus(id: $updateExternalVerificationStatusId, status: $status)
  }
`
export const UPDATE_KYC_VERIFICATION_STATUS = gql`
  mutation UpdateKycVerificationStatus($updateKycVerificationStatusId: ID!, $status: KycVerificationStatus!, $notes: String) {
    updateKycVerificationStatus(id: $updateKycVerificationStatusId, status: $status, notes: $notes)
  }
`

// Types for the GraphQL response
export interface KycPerson {
  id: string
  firstName: string | null
  secondName: string | null
  lastName: string | null
  secondLastName: string | null
  curp: string | null
  email: string | null
  phone: string | null
  street: string | null
  colony: string | null
  city: string | null
  dateOfBirth: string | null
  nationality: string | null
  documentNumber: string | null
  documentType: string | null
}

export interface Company {
  companyName: string
}

export interface Document {
  fileName: string
}

export interface ExternalVerification {
  id: string
  provider: string
  status: string
  requestData: JSON
  responseData: JSON
}

export interface VerificationLink {
  id: string
  lastAccessedAt: string
  status: string
  token: string
}

export interface ActivityLog {
  id: string
  action: string
  timestamp: string
  details: string
}

export interface VerificationWorkflow {
  id: string
  status: string
  currentStep: string
  startedAt: string
  completedAt: string
}

export interface KycVerification {
  id: UUID
  kycPersons: KycPerson[]
  status: string
  company: Company
  documents: Document[]
  externalVerifications: ExternalVerification[]
  verificationLinks: VerificationLink[]
  activityLogs: ActivityLog[]
  verificationWorkflows: VerificationWorkflow[]
  notes: string
  verificationType: string
  updatedAt: string
  createdAt: string
}

export interface KycVerificationsResponse {
  kycVerificationsWithRelations: KycVerification[]
} 