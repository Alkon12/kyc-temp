import { gql } from '@apollo/client';

// Mutation to update contact information via verification token
export const UPDATE_KYC_PERSON_CONTACT_BY_TOKEN = gql`
  mutation UpdateKycPersonContactByToken($token: String!, $email: String!, $phone: String!) {
    updateKycPersonContactByToken(token: $token, email: $email, phone: $phone) {
      id
      firstName
      lastName
      email
      phone
    }
  }
`; 