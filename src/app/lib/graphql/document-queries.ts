import { gql } from '@apollo/client'

// Query para obtener templates activos por companyId
export const GET_ACTIVE_DOCUSEAL_TEMPLATES_BY_COMPANY_ID = gql`
  query GetActiveDocusealTemplatesByCompanyId($companyId: String!) {
    getActiveDocusealTemplatesByCompanyId(companyId: $companyId) {
      id
      name
      description
      documentType
      docusealTemplateId
      isActive
      createdAt
      updatedAt
      fields {
        name
        type
        submitter_uuid
        uuid
        required
      }
    }
  }
`

// Mutation para sincronizar templates de Docuseal
export const SYNC_DOCUSEAL_TEMPLATES = gql`
  mutation SyncDocusealTemplates($companyId: String!) {
    syncDocusealTemplates(companyId: $companyId) {
      id
      name
      description
      documentType
      docusealTemplateId
      isActive
      createdAt
      updatedAt
      fields {
        name
        type
        submitter_uuid
        uuid
        required
      }
    }
  }
`

// Tipos TypeScript para las respuestas
export interface DocusealTemplateField {
  name: string
  type: string
  submitter_uuid: string
  uuid: string
  required: boolean
}

export interface DocusealTemplate {
  id: string
  name: string
  description?: string
  documentType: string
  docusealTemplateId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  fields?: DocusealTemplateField[]
}

export interface GetActiveDocusealTemplatesByCompanyIdResponse {
  getActiveDocusealTemplatesByCompanyId: DocusealTemplate[]
}

export interface SyncDocusealTemplatesResponse {
  syncDocusealTemplates: DocusealTemplate[]
} 