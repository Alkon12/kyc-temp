import { useState, useCallback } from 'react';
import { useApolloClient, ApolloClient } from '@apollo/client';
import VerificationStatusService, { 
  VerificationLinkStatus,
  KycVerificationStatus
} from '@/services/VerificationStatusService';

/**
 * Interface for hook state
 */
interface VerificationStatusState {
  isUpdating: boolean;
  error: string | null;
  lastResponse: {
    verificationLinkSuccess: boolean;
    kycVerificationSuccess: boolean;
  } | null;
}

/**
 * The useVerificationStatus hook provides an easy way to update both 
 * verification link status and KYC verification status simultaneously
 */
export function useVerificationStatus() {
  const apolloClient = useApolloClient();
  const [state, setState] = useState<VerificationStatusState>({
    isUpdating: false,
    error: null,
    lastResponse: null
  });

  // Create an instance of the service
  const statusService = new VerificationStatusService(apolloClient as ApolloClient<any>);

  /**
   * Updates both verification link and KYC verification statuses
   */
  const updateStatus = useCallback(async (
    token: string,
    verificationId: string,
    linkStatus: VerificationLinkStatus
  ) => {
    setState(prev => ({ ...prev, isUpdating: true, error: null }));
    
    try {
      const response = await statusService.updateStatus(token, verificationId, linkStatus);
      
      setState({
        isUpdating: false,
        error: null,
        lastResponse: {
          verificationLinkSuccess: response.verificationLinkSuccess,
          kycVerificationSuccess: response.kycVerificationSuccess
        }
      });
      
      // If there was an error in either update, set the error state
      if (response.verificationLinkError || response.kycVerificationError) {
        setState(prev => ({
          ...prev,
          error: response.verificationLinkError || response.kycVerificationError || null
        }));
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error updating statuses';
      setState({
        isUpdating: false,
        error: errorMessage,
        lastResponse: null
      });
      
      throw error; // Re-throw to allow calling code to handle it if needed
    }
  }, [apolloClient, statusService]);

  /**
   * Accepts terms, updating verification link status to ACCEPTED and KYC status to IN_PROGRESS
   */
  const acceptTerms = useCallback(async (token: string, verificationId: string) => {
    return updateStatus(token, verificationId, VerificationLinkStatus.ACCEPTED);
  }, [updateStatus]);

  /**
   * Rejects terms, updating verification link status to REJECTED and KYC status to REJECTED
   */
  const rejectTerms = useCallback(async (token: string, verificationId: string) => {
    return updateStatus(token, verificationId, VerificationLinkStatus.REJECTED);
  }, [updateStatus]);

  /**
   * Completes FaceTec verification, updating verification link status to FACETEC_COMPLETED
   */
  const completeFaceTec = useCallback(async (token: string, verificationId: string) => {
    return updateStatus(token, verificationId, VerificationLinkStatus.FACETEC_COMPLETED);
  }, [updateStatus]);

  /**
   * Completes verification process, updating verification link status to VERIFICATION_COMPLETED
   */
  const completeVerification = useCallback(async (token: string, verificationId: string) => {
    return updateStatus(token, verificationId, VerificationLinkStatus.VERIFICATION_COMPLETED);
  }, [updateStatus]);

  return {
    // State
    isUpdating: state.isUpdating,
    error: state.error,
    lastResponse: state.lastResponse,
    
    // Status enums for reference
    VerificationLinkStatus,
    KycVerificationStatus,
    
    // Methods
    updateStatus,
    acceptTerms,
    rejectTerms,
    completeFaceTec,
    completeVerification
  };
}

export default useVerificationStatus; 