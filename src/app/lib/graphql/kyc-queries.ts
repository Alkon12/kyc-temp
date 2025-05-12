import { gql } from '@apollo/client'
import { UUID } from 'crypto'

// Query to fetch all KYC verifications with related data
export const GET_KYC_VERIFICATIONS = gql`
  query KycVerificationsWithRelations {
    kycVerificationsWithRelations {
      id
      kycPersons {
        firstName
        lastName
        email
        phone
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
        firstName
        lastName
        email
        phone
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

// Types for the GraphQL response
export interface KycPerson {
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
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