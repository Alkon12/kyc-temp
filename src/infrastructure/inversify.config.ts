import 'reflect-metadata'

import { Container } from 'inversify'
import { DI } from '@infrastructure'
import { LoggingService } from '../application/service/LoggingService'
import { ApolloServer } from './graphql/apollo/ApolloServer'
import { UserResolvers } from '@api/graphql/user/UserResolvers'
import type UserRepository from '@domain/user/UserRepository'
import { PrismaUserRepository } from './repositories/prisma/PrismaUserRepository'
import AbstractUserService from '@domain/user/UserService'
import { NextAuthService } from './auth/nextAuth/NextAuthService'
import { AuthService } from '@/application/service/AuthService'
import { ExternalAuthService } from '@/application/service/ExternalAuthService'
import { ExternalApiAuthJWT } from './auth/externalApiAuth/ExternalApiAuthJWT'
import { ConsoleLogger } from './ConsoleLogger'
import { TestResolvers } from '@api/graphql/test/TestResolvers'
import { KycResolvers } from '@api/graphql/kyc/KycResolvers'
import { VerificationLinkResolvers } from '@api/graphql/verification-link/VerificationLinkResolvers'
import { DocumentResolvers } from '@api/graphql/document/DocumentResolvers'
import { UserService } from '@service/UserService'
import type CompanyRepository from '@domain/company/CompanyRepository'
import { PrismaCompanyRepository } from './repositories/prisma/PrismaCompanyRepository'
import AbstractCompanyService from '@domain/company/CompanyService'
import { CompanyService } from '@service/CompanyService'
import type KycPersonRepository from '@domain/kycPerson/KycPersonRepository'
import { PrismaKycPersonRepository } from './repositories/prisma/PrismaKycPersonRepository'
import AbstractKycPersonService from '@domain/kycPerson/KycPersonService'
import { KycPersonService } from '@service/KycPersonService'
import type KycVerificationRepository from '@domain/kycVerification/KycVerificationRepository'
import { PrismaKycVerificationRepository } from './repositories/prisma/PrismaKycVerificationRepository'
import AbstractKycVerificationService from '@domain/kycVerification/KycVerificationService'
import { KycVerificationService } from '@service/KycVerificationService'
import { CreateKycUseCase } from '@/application/use-cases/CreateKycUseCase'
import { CreateFaceTecSessionUseCase } from '@/application/use-cases/CreateFaceTecSessionUseCase'
import { ProcessFaceTecResultsUseCase } from '@/application/use-cases/ProcessFaceTecResultsUseCase'
import { AssignManualReviewUseCase } from '@/application/use-cases/AssignManualReviewUseCase'
import { KycController } from '@/interfaces/controllers/KycController'
import { FaceTecService } from '@domain/faceTec/FaceTecService'
import { FaceTecServiceImpl } from '@service/FaceTecService'
import { MockFaceTecService } from '@service/MockFaceTecService'
import type VerificationLinkRepository from '@domain/verification-link/VerificationLinkRepository'
import { PrismaVerificationLinkRepository } from './repositories/prisma/PrismaVerificationLinkRepository'
import AbstractVerificationLinkService from '@domain/verification-link/VerificationLinkService'
import { VerificationLinkService } from '@service/VerificationLinkService'
import type DocumentRepository from '@domain/document/DocumentRepository'
import { PrismaDocumentRepository } from './repositories/prisma/PrismaDocumentRepository'
import AbstractDocumentService from '@domain/document/DocumentService'
import { DocumentService } from '@service/DocumentService'
import { FaceTecDocumentService } from '@service/FaceTecDocumentService'
import { PaperlessService } from '@service/PaperlessService'
import { CompanyResolvers } from '@api/graphql/company/CompanyResolvers'
import { ApiKeyAuthService } from '@/application/service/ApiKeyAuthService'
import { FacetecResultService } from '@service/FacetecResultService'
import AbstractFacetecResultService from '@domain/faceTec/FacetecResultService'
import FacetecResultRepository from '@domain/faceTec/FacetecResultRepository'
import { PrismaFacetecResultRepository } from './repositories/prisma/PrismaFacetecResultRepository'
import { FacetecResultResolvers } from '@api/graphql/facetec-result/FacetecResultResolvers'
import ValidationService from '@domain/integration/ValidationService'
import { SoapValidationService } from './repositories/soap/SoapValidationService'
import { KycValidationService } from '@service/KycValidationService'
import { VerificationFlowService } from '@service/VerificationFlowService'
import { VerificationFlowResolvers } from '@api/graphql/verification-flow/VerificationFlowResolvers'

const container = new Container()

container.bind(ApolloServer).toSelf().inSingletonScope()

// Resolvers
container.bind(UserResolvers).toSelf()
container.bind(TestResolvers).toSelf()
container.bind(KycResolvers).toSelf()
container.bind(VerificationLinkResolvers).toSelf()
container.bind(DocumentResolvers).toSelf()
container.bind(CompanyResolvers).toSelf()
container.bind(FacetecResultResolvers).toSelf()
container.bind(VerificationFlowResolvers).toSelf()

// Services
container.bind<LoggingService>(DI.LoggingService).to(ConsoleLogger).inSingletonScope()
container.bind<AuthService>(DI.AuthService).to(NextAuthService).inSingletonScope()
container.bind<ExternalAuthService>(DI.ExternalAuthService).to(ExternalApiAuthJWT).inSingletonScope()
container.bind<PaperlessService>(DI.PaperlessService).to(PaperlessService).inSingletonScope()
container.bind<ValidationService>(DI.ValidationService).to(SoapValidationService).inSingletonScope()

// Domain Services
container.bind<AbstractUserService>(DI.UserService).to(UserService).inSingletonScope()
container.bind<AbstractCompanyService>(DI.CompanyService).to(CompanyService).inSingletonScope()
container.bind<AbstractKycPersonService>(DI.KycPersonService).to(KycPersonService).inSingletonScope()
container.bind<AbstractKycVerificationService>(DI.KycVerificationService).to(KycVerificationService).inSingletonScope()
container.bind<AbstractVerificationLinkService>(DI.VerificationLinkService).to(VerificationLinkService).inSingletonScope()
container.bind<AbstractDocumentService>(DI.DocumentService).to(DocumentService).inSingletonScope()
container.bind<FaceTecDocumentService>(DI.FaceTecDocumentService).to(FaceTecDocumentService).inSingletonScope()
container.bind<AbstractFacetecResultService>(DI.FacetecResultService).to(FacetecResultService).inSingletonScope()
container.bind<KycValidationService>(DI.KycValidationService).to(KycValidationService).inSingletonScope()
container.bind<VerificationFlowService>(DI.VerificationFlowService).to(VerificationFlowService).inSingletonScope()

// Repositories
container.bind<UserRepository>(DI.UserRepository).to(PrismaUserRepository)
container.bind<CompanyRepository>(DI.CompanyRepository).to(PrismaCompanyRepository)
container.bind<KycPersonRepository>(DI.KycPersonRepository).to(PrismaKycPersonRepository)
container.bind<KycVerificationRepository>(DI.KycVerificationRepository).to(PrismaKycVerificationRepository)
container.bind<VerificationLinkRepository>(DI.VerificationLinkRepository).to(PrismaVerificationLinkRepository)
container.bind<DocumentRepository>(DI.DocumentRepository).to(PrismaDocumentRepository)
container.bind<FacetecResultRepository>(DI.FacetecResultRepository).to(PrismaFacetecResultRepository)

// FaceTec Service (usar MockFaceTecService para desarrollo y pruebas)
container.bind<FaceTecService>(DI.FaceTecService).to(MockFaceTecService).inSingletonScope()

// Casos de uso
container.bind<CreateKycUseCase>(DI.CreateKycUseCase).to(CreateKycUseCase)
container.bind<CreateFaceTecSessionUseCase>(DI.CreateFaceTecSessionUseCase).to(CreateFaceTecSessionUseCase)
container.bind<ProcessFaceTecResultsUseCase>(DI.ProcessFaceTecResultsUseCase).to(ProcessFaceTecResultsUseCase)
container.bind<AssignManualReviewUseCase>(DI.AssignManualReviewUseCase).to(AssignManualReviewUseCase)

// Controladores
container.bind<KycController>(DI.KycController).to(KycController)

// Auth Services binding
container.bind<ApiKeyAuthService>(DI.ApiKeyAuthService).to(ApiKeyAuthService).inSingletonScope()

export default container
export { container }
