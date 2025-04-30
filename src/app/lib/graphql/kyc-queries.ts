import { gql } from '@apollo/client'

// Query to fetch all KYC verifications with related data
export const GET_KYC_VERIFICATIONS = gql`
  query KycPersons {
    kycVerificationsWithRelations {
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
  provider: string
  status: string
}

export interface VerificationLink {
  lastAccessedAt: string
  status: string
}

export interface KycVerification {
  kycPersons: KycPerson[]
  status: string
  company: Company
  documents: Document[]
  externalVerifications: ExternalVerification[]
  verificationLinks: VerificationLink[]
  notes: string
  verificationType: string
  updatedAt: string
}

export interface KycVerificationsResponse {
  kycVerificationsWithRelations: KycVerification[]
} 