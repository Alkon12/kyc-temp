import { gql } from '@apollo/client'

export const CREATE_COMPANY = gql`
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      id
      companyName
      apiKey
      callbackUrl
      redirectUrl
      status
    }
  }
`

export const UPDATE_COMPANY = gql`
  mutation UpdateCompany($companyId: ID!, $input: UpdateCompanyInput!) {
    updateCompany(companyId: $companyId, input: $input) {
      id
      companyName
      apiKey
      callbackUrl
      redirectUrl
      status
    }
  }
`

export const DELETE_COMPANY = gql`
  mutation DeleteCompany($companyId: ID!) {
    deleteCompany(companyId: $companyId)
  }
`

export const UPDATE_COMPANY_STATUS = gql`
  mutation UpdateCompanyStatus($companyId: ID!, $status: String!) {
    updateCompanyStatus(companyId: $companyId, status: $status) {
      id
      companyName
      status
    }
  }
`

export const GENERATE_COMPANY_API_KEY = gql`
  mutation GenerateCompanyApiKey($companyId: ID!) {
    generateCompanyApiKey(companyId: $companyId) {
      id
      companyName
      apiKey
      status
    }
  }
` 