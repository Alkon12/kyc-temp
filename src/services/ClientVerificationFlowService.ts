import { VerificationFlow, VerificationFlowFactory } from '@/domain/kycVerification/VerificationFlow';
import { ApolloClient, gql } from '@apollo/client';

// GraphQL query para obtener el flujo de verificación por ID
const GET_VERIFICATION_FLOW_QUERY = gql`
  query GetVerificationFlow($verificationId: ID!) {
    getVerificationFlow(verificationId: $verificationId) {
      type
      isContactFormRequired
      isTimestampSealingRequired
      isINEValidationRequired
      isCURPValidationRequired
      nextStepAfterFaceTec
    }
  }
`;

// GraphQL query para obtener detalles de verificación por ID
const GET_VERIFICATION_DETAILS_QUERY = gql`
  query GetKycVerificationById($verificationId: ID!) {
    getKycVerificationById(verificationId: $verificationId) {
      id
      status
      verificationType
      externalReferenceId
      priority
      riskLevel
      notes
      kycPerson {
        firstName
        lastName
      }
      company {
        companyName
      }
    }
  }
`;

/**
 * Servicio centralizado para gestionar el flujo de verificación KYC en el frontend
 * Este servicio mantiene el estado del flujo de verificación y provee
 * un punto único de consulta para todas las propiedades relacionadas
 */
export class ClientVerificationFlowService {
  private static instance: ClientVerificationFlowService;
  private verificationType: string | null = null;
  private verificationFlow: VerificationFlow | null = null;
  private initialized = false;
  private apolloClient: ApolloClient<any> | null = null;
  private verificationId: string | null = null;
  private verificationDetails: any = null;
  private flowSettings: any = null;

  /**
   * Constructor privado para implementar singleton
   */
  private constructor() {}

  /**
   * Obtener la instancia del servicio (singleton)
   */
  public static getInstance(): ClientVerificationFlowService {
    if (!ClientVerificationFlowService.instance) {
      ClientVerificationFlowService.instance = new ClientVerificationFlowService();
    }
    return ClientVerificationFlowService.instance;
  }
  
  /**
   * Configurar el cliente Apollo para las consultas GraphQL
   */
  public setApolloClient(client: ApolloClient<any>): ClientVerificationFlowService {
    this.apolloClient = client;
    return this;
  }

  /**
   * Inicializar el servicio con el tipo de verificación
   * @param verificationType Tipo de verificación (bronze, silver, gold)
   * @returns this para encadenamiento de métodos
   */
  public initialize(verificationType: string): ClientVerificationFlowService {
    if (!verificationType) {
      console.error('Error: Se intentó inicializar ClientVerificationFlowService con un tipo vacío');
      return this;
    }

    try {
      this.verificationType = verificationType.toLowerCase();
      this.verificationFlow = VerificationFlowFactory.createFlow(this.verificationType);
      this.initialized = true;
      console.log(`ClientVerificationFlowService inicializado con tipo: ${this.verificationType}`);
    } catch (error) {
      console.error('Error al inicializar ClientVerificationFlowService:', error);
    }
    
    return this;
  }
  
  /**
   * Inicializar el servicio a partir del ID de verificación mediante GraphQL
   * @param verificationId ID de la verificación
   * @returns Promise que resuelve a this para encadenamiento
   */
  public async initializeByVerificationId(verificationId: string): Promise<ClientVerificationFlowService> {
    if (!this.apolloClient) {
      console.error('Error: Apollo Client no configurado. Llame a setApolloClient primero.');
      return this;
    }
    
    if (!verificationId) {
      console.error('Error: Se intentó inicializar con ID de verificación vacío');
      return this;
    }
    
    this.verificationId = verificationId;
    
    try {
      // Obtener detalles de verificación
      const { data: verificationData } = await this.apolloClient.query({
        query: GET_VERIFICATION_DETAILS_QUERY,
        variables: { verificationId }
      });
      
      this.verificationDetails = verificationData?.getKycVerificationById;
      
      if (!this.verificationDetails) {
        throw new Error(`No se encontraron detalles para la verificación con ID: ${verificationId}`);
      }
      
      // Obtener flujo de verificación
      const { data: flowData } = await this.apolloClient.query({
        query: GET_VERIFICATION_FLOW_QUERY,
        variables: { verificationId }
      });
      
      this.flowSettings = flowData?.getVerificationFlow;
      
      // Inicializar con el tipo de verificación obtenido
      const verificationType = this.verificationDetails.verificationType;
      if (verificationType) {
        this.initialize(verificationType);
        console.log(`ClientVerificationFlowService inicializado para verificación ${verificationId} con tipo ${verificationType}`);
      } else {
        throw new Error('No se pudo determinar el tipo de verificación');
      }
      
      return this;
    } catch (error) {
      console.error('Error al inicializar por ID de verificación:', error);
      return this;
    }
  }

  /**
   * Verificar si el servicio ha sido inicializado
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Obtener el tipo de verificación actual
   */
  public getVerificationType(): string | null {
    this.checkInitialization();
    return this.verificationType;
  }
  
  /**
   * Obtener el ID de verificación si está disponible
   */
  public getVerificationId(): string | null {
    return this.verificationId;
  }
  
  /**
   * Obtener los detalles completos de la verificación
   */
  public getVerificationDetails(): any {
    return this.verificationDetails;
  }
  
  /**
   * Obtener la configuración del flujo de verificación
   */
  public getFlowSettings(): any {
    return this.flowSettings;
  }

  /**
   * Verificar si el tipo de verificación actual es Bronze
   */
  public isBronzeVerification(): boolean {
    this.checkInitialization();
    return this.verificationType === 'bronze';
  }

  /**
   * Verificar si el tipo de verificación actual es Silver
   */
  public isSilverVerification(): boolean {
    this.checkInitialization();
    return this.verificationType === 'silver';
  }

  /**
   * Verificar si el tipo de verificación actual es Gold
   */
  public isGoldVerification(): boolean {
    this.checkInitialization();
    return this.verificationType === 'gold';
  }

  /**
   * Verificar si se requiere el formulario de contacto
   */
  public isContactFormRequired(): boolean {
    this.checkInitialization();
    
    // Si tenemos flowSettings, usamos esa información
    if (this.flowSettings && this.flowSettings.isContactFormRequired !== undefined) {
      return this.flowSettings.isContactFormRequired;
    }
    
    // Si no, usamos la lógica basada en el tipo
    return this.verificationFlow?.isContactFormRequired() || false;
  }

  /**
   * Verificar si se requiere sellado de tiempo
   */
  public isTimestampSealingRequired(): boolean {
    this.checkInitialization();
    
    // Si tenemos flowSettings, usamos esa información
    if (this.flowSettings && this.flowSettings.isTimestampSealingRequired !== undefined) {
      return this.flowSettings.isTimestampSealingRequired;
    }
    
    // Si no, usamos la lógica basada en el tipo
    return this.verificationFlow?.isTimestampSealingRequired() || false;
  }

  /**
   * Verificar si se requiere validación de INE
   */
  public isINEValidationRequired(): boolean {
    this.checkInitialization();
    
    // Si tenemos flowSettings, usamos esa información
    if (this.flowSettings && this.flowSettings.isINEValidationRequired !== undefined) {
      return this.flowSettings.isINEValidationRequired;
    }
    
    // Si no, usamos la lógica basada en el tipo
    return this.verificationFlow?.isINEValidationRequired() || false;
  }

  /**
   * Verificar si se requiere validación de CURP para el flujo actual
   * Esta es la función centralizada que determina si se debe validar la CURP
   * @returns true si la validación de CURP es requerida, false de lo contrario
   */
  public isCURPValidationRequired(): boolean {
    // 1. Verificar si tenemos configuración explícita en flowSettings
    if (this.flowSettings && this.flowSettings.isCURPValidationRequired !== undefined) {
      return this.flowSettings.isCURPValidationRequired;
    }
    
    // 2. Verificar por tipo de verificación
    const verificationType = this.getVerificationType();
    if (verificationType) {
      // La validación de CURP es requerida para verificaciones Gold
      if (verificationType.toLowerCase() === 'gold') {
        return true;
      }
    }
    
    // 3. Usar el flujo de verificación como fallback
    return this.verificationFlow?.isCURPValidationRequired() || false;
  }

  /**
   * Obtener el siguiente paso después de FaceTec
   */
  public getNextStepAfterFaceTec(): 'complete' | 'contact' {
    this.checkInitialization();
    
    // Si tenemos flowSettings, usamos esa información
    if (this.flowSettings && this.flowSettings.nextStepAfterFaceTec) {
      return this.flowSettings.nextStepAfterFaceTec as 'complete' | 'contact';
    }
    
    // Si no, usamos la lógica basada en el tipo
    return this.verificationFlow?.getNextStepAfterFaceTec() || 'complete';
  }

  /**
   * Verificar que el servicio esté inicializado
   * @throws Error si el servicio no está inicializado
   */
  private checkInitialization(): void {
    if (!this.initialized) {
      console.warn('ClientVerificationFlowService no ha sido inicializado. Inicialice con un tipo de verificación válido antes de usarlo.');
    }
  }
}

// Exportar una instancia singleton del servicio
export default ClientVerificationFlowService.getInstance(); 