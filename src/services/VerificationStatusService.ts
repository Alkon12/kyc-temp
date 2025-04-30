import { ApolloClient, gql } from '@apollo/client';

/**
 * Represents the different status values for verification links
 */
export enum VerificationLinkStatus {
  ACTIVE = 'active',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  FACETEC_COMPLETED = 'facetec_completed',
  CONTACT_SUBMITTED = 'contact_submitted',
  VERIFICATION_COMPLETED = 'verification_completed',
  EXPIRED = 'expired',
  INVALIDATED = 'invalidated'
}

/**
 * Represents the different status values for KYC verifications
 */
export enum KycVerificationStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REQUIRES_REVIEW = 'REQUIRES_REVIEW'
}

/**
 * Interface for status update responses
 */
interface StatusUpdateResponse {
  verificationLinkSuccess: boolean;
  verificationLinkError?: string;
  kycVerificationSuccess: boolean;
  kycVerificationError?: string;
}

/**
 * Maps verification link statuses to corresponding KYC verification statuses
 */
const STATUS_MAPPING: Record<VerificationLinkStatus, KycVerificationStatus | null> = {
  [VerificationLinkStatus.ACTIVE]: KycVerificationStatus.PENDING,
  [VerificationLinkStatus.ACCEPTED]: KycVerificationStatus.IN_PROGRESS,
  [VerificationLinkStatus.REJECTED]: KycVerificationStatus.REJECTED,
  [VerificationLinkStatus.FACETEC_COMPLETED]: null, // No change to KYC status
  [VerificationLinkStatus.CONTACT_SUBMITTED]: null, // No change to KYC status
  [VerificationLinkStatus.VERIFICATION_COMPLETED]: null, // No change to KYC status
  [VerificationLinkStatus.EXPIRED]: null, // No change to KYC status
  [VerificationLinkStatus.INVALIDATED]: null // No change to KYC status
};

/**
 * GraphQL mutation for updating verification link status
 */
const UPDATE_VERIFICATION_LINK_STATUS = gql`
  mutation UpdateVerificationLinkStatus($token: String!, $status: String!) {
    updateVerificationLinkStatus(token: $token, status: $status) {
      id
      status
      updatedAt
    }
  }
`;

/**
 * GraphQL mutation for updating KYC verification status
 */
const UPDATE_KYC_VERIFICATION_STATUS = gql`
  mutation UpdateKycVerificationStatus($id: ID!, $status: KycVerificationStatus!) {
    updateKycVerificationStatus(id: $id, status: $status)
  }
`;

/**
 * Service responsible for synchronizing verification link and KYC verification statuses
 */
export class VerificationStatusService {
  private apolloClient: ApolloClient<any>;

  /**
   * Creates a new instance of VerificationStatusService
   * @param apolloClient The Apollo client used for GraphQL queries and mutations
   */
  constructor(apolloClient: ApolloClient<any>) {
    this.apolloClient = apolloClient;
  }

  /**
   * Updates both verification link status and KYC verification status when needed
   * @param token The verification link token
   * @param verificationId The KYC verification ID
   * @param linkStatus The new verification link status
   * @returns A promise resolving to the status update response
   */
  public async updateStatus(
    token: string, 
    verificationId: string, 
    linkStatus: VerificationLinkStatus
  ): Promise<StatusUpdateResponse> {
    const response: StatusUpdateResponse = {
      verificationLinkSuccess: false,
      kycVerificationSuccess: false
    };

    try {
      // Update verification link status
      const linkUpdateResult = await this.apolloClient.mutate({
        mutation: UPDATE_VERIFICATION_LINK_STATUS,
        variables: { 
          token, 
          status: linkStatus 
        }
      });

      response.verificationLinkSuccess = !!linkUpdateResult.data?.updateVerificationLinkStatus;
      
      // Check if we need to update KYC verification status based on the mapping
      const kycStatus = STATUS_MAPPING[linkStatus];
      
      if (kycStatus) {
        try {
          const kycUpdateResult = await this.apolloClient.mutate({
            mutation: UPDATE_KYC_VERIFICATION_STATUS,
            variables: { 
              id: verificationId, 
              status: kycStatus 
            }
          });
          
          response.kycVerificationSuccess = !!kycUpdateResult.data?.updateKycVerificationStatus;
        } catch (error) {
          response.kycVerificationError = error instanceof Error ? error.message : 'Unknown error updating KYC verification status';
          console.error('Error updating KYC verification status:', error);
        }
      } else {
        // No KYC status update needed for this link status
        response.kycVerificationSuccess = true;
      }
    } catch (error) {
      response.verificationLinkError = error instanceof Error ? error.message : 'Unknown error updating verification link status';
      console.error('Error updating verification link status:', error);
    }

    return response;
  }

  /**
   * Updates verification link status to ACCEPTED and KYC verification status to IN_PROGRESS
   * @param token The verification link token 
   * @param verificationId The KYC verification ID
   * @returns A promise resolving to the status update response
   */
  public async acceptTerms(token: string, verificationId: string): Promise<StatusUpdateResponse> {
    return this.updateStatus(token, verificationId, VerificationLinkStatus.ACCEPTED);
  }

  /**
   * Updates verification link status to REJECTED and KYC verification status to REJECTED
   * @param token The verification link token
   * @param verificationId The KYC verification ID
   * @returns A promise resolving to the status update response
   */
  public async rejectTerms(token: string, verificationId: string): Promise<StatusUpdateResponse> {
    return this.updateStatus(token, verificationId, VerificationLinkStatus.REJECTED);
  }

  /**
   * Updates verification link status to FACETEC_COMPLETED
   * @param token The verification link token
   * @param verificationId The KYC verification ID
   * @returns A promise resolving to the status update response
   */
  public async completeFaceTec(token: string, verificationId: string): Promise<StatusUpdateResponse> {
    return this.updateStatus(token, verificationId, VerificationLinkStatus.FACETEC_COMPLETED);
  }

  /**
   * Updates verification link status to VERIFICATION_COMPLETED
   * @param token The verification link token
   * @param verificationId The KYC verification ID
   * @returns A promise resolving to the status update response
   */
  public async completeVerification(token: string, verificationId: string): Promise<StatusUpdateResponse> {
    return this.updateStatus(token, verificationId, VerificationLinkStatus.VERIFICATION_COMPLETED);
  }
}

export default VerificationStatusService; 