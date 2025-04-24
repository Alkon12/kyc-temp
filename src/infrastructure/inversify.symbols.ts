export const DI = {
  LoggingService: Symbol.for('LoggingService'),
  UserService: Symbol.for('UserService'),
  AuthService: Symbol.for('AuthService'),
  ExternalAuthService: Symbol.for('ExternalAuthService'),
  
  ValidationService: Symbol.for('ValidationService'),
  KycValidationService: Symbol.for('KycValidationService'),
  VerificationFlowService: Symbol.for('VerificationFlowService'),
  
  UserRepository: Symbol.for('UserRepository'),
  CompanyRepository: Symbol.for('CompanyRepository'),
  CompanyService: Symbol.for('CompanyService'),
  KycPersonRepository: Symbol.for('KycPersonRepository'),
  KycPersonService: Symbol.for('KycPersonService'),
  KycVerificationRepository: Symbol.for('KycVerificationRepository'),
  KycVerificationService: Symbol.for('KycVerificationService'),
  VerificationLinkRepository: Symbol.for('VerificationLinkRepository'),
  VerificationLinkService: Symbol.for('VerificationLinkService'),
  DocumentRepository: Symbol.for('DocumentRepository'),
  DocumentService: Symbol.for('DocumentService'),
  FaceTecDocumentService: Symbol.for('FaceTecDocumentService'),
  PaperlessService: Symbol.for('PaperlessService'),
  
  // FaceTec
  FaceTecService: Symbol.for('FaceTecService'),
  FacetecResultRepository: Symbol.for('FacetecResultRepository'),
  FacetecResultService: Symbol.for('FacetecResultService'),
  
  // Casos de uso
  CreateKycUseCase: Symbol.for('CreateKycUseCase'),
  CreateFaceTecSessionUseCase: Symbol.for('CreateFaceTecSessionUseCase'),
  ProcessFaceTecResultsUseCase: Symbol.for('ProcessFaceTecResultsUseCase'),
  AssignManualReviewUseCase: Symbol.for('AssignManualReviewUseCase'),
  
  // Controladores
  KycController: Symbol.for('KycController'),
  
  ApiKeyAuthService: Symbol.for('ApiKeyAuthService'),
}
