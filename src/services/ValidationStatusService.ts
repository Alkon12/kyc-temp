import { ApolloClient, gql } from '@apollo/client';
import { KycVerificationStatus } from './VerificationStatusService';

/**
 * GraphQL mutation for updating KYC verification status
 */
const UPDATE_KYC_VERIFICATION_STATUS = gql`
  mutation UpdateKycVerificationStatus($id: ID!, $status: KycVerificationStatus!) {
    updateKycVerificationStatus(id: $id, status: $status)
  }
`;

/**
 * Interface for validation result to allow generic handling
 */
export interface ValidationResult {
  success: boolean;
  message?: string;
  error?: any;
  data?: any;
}

/**
 * Service to handle common validation status updates, used by validation hooks
 */
export class ValidationStatusService {
  private apolloClient: ApolloClient<any>;

  /**
   * Creates a new instance of ValidationStatusService
   * @param apolloClient The Apollo client used for GraphQL mutations
   */
  constructor(apolloClient: ApolloClient<any>) {
    this.apolloClient = apolloClient;
  }

  /**
   * Updates KYC verification status based on validation result
   * @param verificationId The KYC verification ID
   * @param validationResult The validation result object
   * @param validationType The type of validation for logging purposes
   * @returns A promise that resolves to a success status
   */
  public async updateKycStatusFromValidation(
    verificationId: string,
    validationResult: ValidationResult,
    validationType: string = 'general'
  ): Promise<boolean> {
    if (!verificationId) {
      console.error('No se puede actualizar el estado de verificación sin un ID de verificación');
      return false;
    }

    // If validation was successful, do nothing
    if (validationResult.success) {
      console.log(`Validación ${validationType} exitosa, no se requiere cambio de estado de la verificación`);
      return true;
    }

    try {
      // Update KYC status to REQUIRES_REVIEW for failed validations
      const result = await this.apolloClient.mutate({
        mutation: UPDATE_KYC_VERIFICATION_STATUS,
        variables: {
          id: verificationId,
          status: KycVerificationStatus.REQUIRES_REVIEW
        }
      });
      
      const success = !!result.data?.updateKycVerificationStatus;
      if (success) {
        console.log(`Estado de verificación KYC actualizado a REQUIRES_REVIEW debido a validación ${validationType} fallida`);
      } else {
        console.error(`Error al actualizar estado de verificación KYC para validación ${validationType} fallida`);
      }
      
      return success;
    } catch (error) {
      console.error(`Error al actualizar estado de verificación KYC para validación ${validationType}:`, error);
      return false;
    }
  }

  /**
   * Updates external verification status and KYC status in a single operation
   * @param verificationId The KYC verification ID
   * @param validationResult The validation result object
   * @param saveExternalVerification Function to save external verification result
   * @param validationType The type of validation for logging purposes
   * @returns A promise that resolves to a success status
   */
  public async handleValidationResult(
    verificationId: string,
    validationResult: ValidationResult,
    saveExternalVerification: () => Promise<boolean>,
    validationType: string = 'general'
  ): Promise<boolean> {
    try {
      // First, save the external verification result
      const externalSaveSuccess = await saveExternalVerification();
      
      // If validation failed, update KYC status
      if (!validationResult.success) {
        await this.updateKycStatusFromValidation(
          verificationId, 
          validationResult, 
          validationType
        );
      }
      
      return externalSaveSuccess;
    } catch (error) {
      console.error(`Error al manejar resultado de validación ${validationType}:`, error);
      return false;
    }
  }
}

export default ValidationStatusService; 