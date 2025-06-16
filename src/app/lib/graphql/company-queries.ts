import { gql } from '@apollo/client'

export const GET_ALL_COMPANIES = gql`
  query GetAllCompanies {
    getAllCompanies {
      id
      companyName
      apiKey
      callbackUrl
      redirectUrl
      status
    }
  }
`

export const GET_COMPANY_BY_ID = gql`
  query GetCompanyById($companyId: ID!) {
    getCompanyById(companyId: $companyId) {
      id
      companyName
      apiKey
      callbackUrl
      redirectUrl
      status
    }
  }
` 