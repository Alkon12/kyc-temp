/**
 * Interface defining the verification flow strategy for different verification tiers
 */
export interface VerificationFlow {
  /**
   * Check if the contact form step is required in this flow
   */
  isContactFormRequired(): boolean;
  
  /**
   * Check if timestamp sealing is required for documents in this flow
   */
  isTimestampSealingRequired(): boolean;
  
  /**
   * Check if INE validation with lista nominal is required in this flow
   */
  isINEValidationRequired(): boolean;
  
  /**
   * Check if CURP validation is required in this flow
   */
  isCURPValidationRequired(): boolean;
  
  /**
   * Get the next step after FaceTec verification completes
   */
  getNextStepAfterFaceTec(): 'complete' | 'contact';
  
  /**
   * Get the unique verification flow name
   */
  getName(): string;
}

/**
 * Bronze tier verification flow - most basic level
 */
export class BronzeVerificationFlow implements VerificationFlow {
  isContactFormRequired(): boolean {
    return false;
  }
  
  isTimestampSealingRequired(): boolean {
    return false;
  }
  
  isINEValidationRequired(): boolean {
    return false;
  }
  
  isCURPValidationRequired(): boolean {
    return false;
  }
  
  getNextStepAfterFaceTec(): 'complete' | 'contact' {
    return 'complete';
  }
  
  getName(): string {
    return 'bronze';
  }
}

/**
 * Silver tier verification flow - medium security level
 */
export class SilverVerificationFlow implements VerificationFlow {
  isContactFormRequired(): boolean {
    return true;
  }
  
  isTimestampSealingRequired(): boolean {
    return true;
  }
  
  isINEValidationRequired(): boolean {
    return false;
  }
  
  isCURPValidationRequired(): boolean {
    return false;
  }
  
  getNextStepAfterFaceTec(): 'complete' | 'contact' {
    return 'contact';
  }
  
  getName(): string {
    return 'silver';
  }
}

/**
 * Gold tier verification flow - highest security level
 */
export class GoldVerificationFlow implements VerificationFlow {
  isContactFormRequired(): boolean {
    return true;
  }
  
  isTimestampSealingRequired(): boolean {
    return true;
  }
  
  isINEValidationRequired(): boolean {
    return true;
  }
  
  isCURPValidationRequired(): boolean {
    return true;
  }
  
  getNextStepAfterFaceTec(): 'complete' | 'contact' {
    return 'contact';
  }
  
  getName(): string {
    return 'gold';
  }
}

/**
 * Factory to create the appropriate verification flow based on the tier
 */
export class VerificationFlowFactory {
  static createFlow(type: string): VerificationFlow {
    switch(type.toLowerCase()) {
      case 'bronze':
        return new BronzeVerificationFlow();
      case 'silver':
        return new SilverVerificationFlow();
      case 'gold':
        return new GoldVerificationFlow();
      default:
        throw new Error(`Unknown verification type: ${type}`);
    }
  }
} 