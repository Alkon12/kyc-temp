import 'reflect-metadata'

import { Container } from 'inversify'
import { DI } from '@infrastructure'
import LeadRepository from '../domain/lead/LeadRepository'
import { LoggingService } from '../application/service/LoggingService'
import { PrismaLeadRepository } from './repositories/prisma/PrismaLeadRepository'
import { LeadService } from '../service/LeadService'
import AbstractLeadService from '@domain/lead/LeadService'
import { ApolloServer } from './graphql/apollo/ApolloServer'
import { LeadResolvers } from '@api/graphql/lead/LeadResolvers'
import { QuoteResolvers } from '@api/graphql/quote/QuoteResolvers'
import AbstractQuoteService from '@domain/quote/QuoteService'
import QuoteRepository from '@domain/quote/QuoteRepository'
import { PrismaQuoteRepository } from './repositories/prisma/PrismaQuoteRepository'
import OfferRepository from '@domain/offer/OfferRepository'
import ProductRepository from '@domain/product/ProductRepository'
import { PrismaOfferRepository } from './repositories/prisma/PrismaOfferRepository'
import { PrismaProductRepository } from './repositories/prisma/PrismaProductRepository'
import { UberAPI } from './uber/UberAPI'
import { UberService } from '@/application/service/UberService'
import { ParamHeaderResolvers } from '@api/graphql/paramheader/ParamHeaderResolver'
import AbstractParamHeaderService from '@domain/paramheader/ParamHeaderService'
import { ParamHeaderService } from '@service/ParamHeaderService'
import ParamHeaderRepository from '@domain/paramheader/ParamHeaderRepository'
import { PrismaParamHeaderRepository } from './repositories/prisma/PrismaParamHeaderRepository'
import { OfferService } from '@service/OfferService'
import AbstractOfferService from '@domain/offer/OfferService'
import { OfferResolvers } from '@api/graphql/offer/OfferResolvers'
import { InventoryResolvers } from '@api/graphql/inventory/InventoryResolvers'
import { InventoryService } from '@service/InventoryService'
import AbstractInventoryService from '@domain/inventory/InventoryService'
import { UserResolvers } from '@api/graphql/user/UserResolvers'
import type UserRepository from '@domain/user/UserRepository'
import { PrismaUserRepository } from './repositories/prisma/PrismaUserRepository'
import AbstractUserService from '@domain/user/UserService'
import { UserService } from '@service/UserService'
import AbstractTaskService from '@domain/task/TaskService'
import { PrismaTaskRepository } from './repositories/prisma/PrismaTaskRepository'
import TaskRepository from '@domain/task/TaskRepository'
import { TaskService } from '@service/TaskService'
import { TaskResolvers } from '@api/graphql/task/TaskResolvers'
import { ApplicationResolvers } from '@api/graphql/application/ApplicationResolvers'
import AbstractApplicationService from '@domain/application/ApplicationService'
import { ApplicationService } from '@service/ApplicationService'
import ApplicationRepository from '@domain/application/ApplicationRepository'
import { PrismaApplicationRepository } from './repositories/prisma/PrismaApplicationRepository'
import { TaskManager } from '@domain/task/TaskManager'
import { NextAuthService } from './auth/nextAuth/NextAuthService'
import { AuthService } from '@/application/service/AuthService'
import { ExternalAuthService } from '@/application/service/ExternalAuthService'
import { ExternalApiAuthJWT } from './auth/externalApiAuth/ExternalApiAuthJWT'
import { NotificationService } from '@/application/service/NotificationService'
import { ChatwootNotification } from './notifications/chatwoot/v1/ChatwootNotification'
import { ScoringService } from '@/application/service/ScoringService'
import { ScoringNodeRed } from './scoring/nodered/v2/ScoringNodeRed'
import AddressRepository from '@domain/address/AddressRepository'
import { PrismaAddressRepository } from './repositories/prisma/PrismaAddressRepository'
import { ConsoleLogger } from './ConsoleLogger'
import { PersonResolvers } from '@api/graphql/person/PersonResolvers'
import AbstractPersonService from '@domain/person/PersonService'
import { PersonService } from '@service/PersonService'
import PersonRepository from '@domain/person/PersonRepository'
import { PersonApi } from './smartit/PersonApi'
import AbstractProspectService from '@domain/prospect/ProspectService'
import { ProspectService } from '@service/ProspectService'
import { ProspectResolvers } from '@api/graphql/prospect/ProspectResolvers'
import { KycResolvers } from '@api/graphql/kyc/KycResolvers'
import AbstractKycService from '@domain/kyc/KycService'
import { KycService } from '@service/KycService'
import AbstractClientService from '@domain/client/KycService'
import { ClientService } from '@service/ClientService'
import { ClientResolvers } from '@api/graphql/client/ClientResolvers'
import { ContentService } from '@/application/service/ContentService'
import { PaperlessAPI } from './content/PaperlessAPI'
import ContentQueueRepository from '@domain/content/ContentQueueRepository'
import { PrismaContentQueueRepository } from './repositories/prisma/PrismaContentQueueRepository'
import { ContentQueueService } from '@service/ContentQueueService'
import AbstractContentQueueService from '@domain/content/ContentQueueService'
import AbstractApplicationChecklistService from '@domain/applicationChecklist/ApplicationChecklistService'
import { ApplicationChecklistService } from '@service/ApplicationChecklistService'
import { PrismaApplicationChecklistRepository } from './repositories/prisma/PrismaApplicationChecklistRepository'
import ApplicationChecklistRepository from '@domain/applicationChecklist/ApplicationChecklistRepository'
import { ApplicationChecklistResolvers } from '@api/graphql/applicationChecklist/ApplicationChecklistResolvers'
import { SlotResolvers } from '@api/graphql/slot/SlotResolvers'
import AbstractSlotService from '@domain/slot/SlotService'
import { SlotService } from '@service/SlotService'
import SlotRepository from '@domain/slot/SlotRepository'
import { PrismaSlotRepository } from './repositories/prisma/PrismaSlotRepository'
import { MeetingService } from '@/application/service/MeetingService'
import { JitsiMeeting } from './meeting/jitsi/JitsiMeeting'
import VehicleRepository from '@domain/vehicle/VehicleRepository'
import { PrismaVehicleRepository } from './repositories/prisma/PrismaVehicleRepository'
import { ParseService } from '@/application/service/ParseService'
import { CustomParser } from './parsers/CustomParser'
import { TestResolvers } from '@api/graphql/test/TestResolvers'
import { AuditService } from '@/application/service/AuditService'
import { MongoDBAudit } from './audit/MongoDBAudit'
import AbstractLeasingService from '@domain/leasing/LeasingService'
import { LeasingService } from '@service/LeasingService'
import TripRepository from '@domain/trip/TripRepository'
import { PrismaTripRepository } from './repositories/prisma/PrismaTripRepository'
import { PrismaLeasingRepository } from './repositories/prisma/PrismaLeasingRepository'
import LeasingRepository from '@domain/leasing/LeasingRepository'
import AbstractTripService from '@domain/trip/TripService'
import { TripService } from '@service/TripService'
import { LeasingResolvers } from '@api/graphql/leasing/LeasingResolvers'
import { DateService } from '@/application/service/DateService'
import { MomentDateService } from './date/MomentDateService'
import { TrackerService } from '@/application/service/TrackerService'
import { TrackerGraphile } from './tracker/TrackerGraphile'
import { AlarmService } from '@/application/service/AlarmService'
import { AlarmGraphile } from './alarm/AlarmGraphile'
import { AnalyticsService } from '@/application/service/AnalyticsService'
import { AnalyticsGraphile } from './analytics/AnalyticsGraphile'
import { FinancialService } from '@/application/service/FinancialService'
import { FinancialSmartIt } from './financial/FinancialSmartIt'
import { VehicleInventoryResolvers } from '@api/graphql/inventorySmarIt/InventorySmartItResolvers'
import { VehicleInventoryService } from '@service/VehicleInventoryService'
import VehicleInventoryRepository from '@domain/inventorySmartIt/VehicleInventoryRepository'
import AbstractVehicleInventoryService from '@domain/inventorySmartIt/VehicleInventoryService'
import { VehicleInventoryApi } from './smartit/VehicleInventoryApi'
import { PersonResgisApi } from './smartit/PersonResgisApi'
import PersonRegiRepository from '@domain/onBoarding/PersonRegiRepository'
import AbstractPersonRegiService from '@domain/onBoarding/PersonRegiService'
import { PersonRegisResolvers } from '@api/graphql/personRegis/PersonRegisResolvers'
import PersonUpdateRepository from '@domain/personUpdate/PersonUpdateRepository'
import { PersonRegisService } from '@service/PersonRegisService'
import { PersonUpdateApi } from '@infrastructure/smartit/PersonUpdateApi'
import AbstractPersonUpdateService from '@domain/personUpdate/PersonUpdateService'
import { PersonUpdateService } from '@service/PersonUpdateService'
import { PersonUpdateResolvers } from '@api/graphql/personUpdate/PersonUpdateResolvers'
import { QuoteSmartItApi } from '@infrastructure/smartit/QuoteSmartItApi'
import QuoteSmartItRepository from '@domain/quoteSmartIt/QuoteSmartItRepository'
import AbstractQuoteSmartItService from '@domain/quoteSmartIt/AbstractQuoteSmartItService'
import { QuoteSmartItService } from '@service/QuoteSmartItService'
import { QuoteSmartItResolvers } from '@api/graphql/quoteSmarIt/QuoteSmartItResolvers'
import AbstractVehicleReservationService from '@domain/vehicleReservation/AbstractVehicleReservationService'
import VehicleReservationRepository from '@domain/vehicleReservation/VehicleReservationRepository'
;``
import { VehicleReservationService } from '@service/VehicleReservationService'
import { VehicleReservationResolvers } from '@api/graphql/vehicleReservation/VehicleReservationResolvers'
import { VehicleReservationApi } from '@infrastructure/smartit/VehicleReservationApi'
import { ContractApi } from '@infrastructure/smartit/ContractApi'
import { ContractResolvers } from '@api/graphql/contract/ContractResolvers'
import AbstractContractService from '@domain/contract/AbstractContractService'
import { ContractService } from '@service/ContractService'
import ContractRepository from '@domain/contract/ContractRepository'
import { PaymentValidationApi } from '@infrastructure/smartit/PaymentValidationApi'
import AbstractPaymentValidationService from '@domain/paymentValidation/AbstractPaymentValidationService'
import PaymentValidationRepository from '@domain/paymentValidation/PaymentValidationRepository'
import { PaymentValidationService } from '@service/PaymentValidationService'
import { PaymentValidationResolvers } from '@api/graphql/paymentValidation/PaymentValidationResolvers'
import { DeliveryResolvers } from '@api/graphql/delivery/DeliveryResolvers'
import AbstractDeliveryService from '@domain/delivery/AbstractDeliveryService'
import { DeliveryService } from '@service/DeliveryService'
import type DeliveryRepository from '@domain/delivery/DeliveryRepository'
import { DeliveryApi } from '@infrastructure/smartit/DeliveryApi'
import { ContractSigningService } from '@service/ContractSigningService'
import { ContractSigningApi } from '@infrastructure/smartit/ContractSigningApi'
import AbstractContractSigningService from '@domain/contractSigning/AbstractContractSigningService'
import ContractSigningRepository from '@domain/contractSigning/ContractSigningRepository'
import { ContractSigningResolvers } from '@api/graphql/contractSigning/ContractSigningResolvers'
import { PrismaProspectRepository } from './repositories/prisma/PrismaProspectRepository'
import ProspectRepository from '@domain/prospect/ProspectRepository'
import ProspectActivityRepository from '@domain/prospect/ProspectActivityRepository'
import { PrismaProspectActivityRepository } from './repositories/prisma/PrismaProspectActivityRepository'
import { PendingDocumentsResolvers } from '@api/graphql/pendingDocuments/PendingDocumentsResolvers'
import { PendingDocumentsService } from '@service/PendingDocumentsService'
import { PendingDocumentsApi } from '@infrastructure/smartit/PendingDocumentsApi'
import PendingDocumentsRepository from '@domain/pendingDocuments/PendingDocumentsRepository'
import AbstractPendingDocumentsService from '@domain/pendingDocuments/AbstractPendingDocumentsService'
import { ConversationService } from '@/application/service/ConversationService'
import { ChatwootConversation } from './conversation/chatwoot/v1/ChatwootConversation'
import { ConversationResolvers } from '@api/graphql/conversation/ConversationResolvers'
import { DeviceTokenService } from '@service/DeviceTokenService'
import AbstractDeviceTokenService from '@domain/deviceToken/AbstractDeviceTokenService'
import DeviceTokenRepository from '@domain/deviceToken/DeviceTokenRepository'
import { PrismaDeviceTokenRepository } from './repositories/prisma/PrismaDeviceTokenRepository'
import { DeviceTokensResolvers } from '@api/graphql/deviceTokens/DeviceTokensResolvers'

import IncidentSmartItService from '@domain/incident/IncidentSmartItService'
import { IncidentResolvers } from '@api/graphql/incident/IncidentResolvers'
import { IncidentApi } from './smartit/IncidentApi'

import { UberRegistrySmartItService } from '@service/UberRegistrySmartItService'
import AbstractUberRegistrySmartItService from '@domain/uberRegistrySmartIt/AbstractUberRegistrySmartItService'
import { UberRegistryApi } from './smartit/UberRegistryApi'
import UberRegistrySmartItRepository from '@domain/uberRegistrySmartIt/UberRegistrySmartItRepository'

import { VehicleResolvers } from '@api/graphql/vehicle/VehicleResolvers'

import { VehicleSmartItService } from '@service/VehicleSmartItService'
import AbstractVehicleSmartItService from '@domain/vehicleSmartIt/AbstractVehicleSmartItService'
import { VehicleSmartItApi } from './smartit/VehicleSmartItApi'
import VehicleSmartItRepository from '@domain/vehicleSmartIt/VehicleSmartItRepository'
import { TaxPersonService } from '@service/TaxPersonService'
import AbstractTaxPersonaService from '@domain/taxPerson/TaxPersonService'
import { GetTaxPersonService } from '@/application/service/GetTaxPersonService'
import { GetDataTaxPerson } from './getTaxPerson/GetDataTaxPerson'
import { TaxPersonResolver } from '@api/graphql/taxPerson/TaxPersonResolver'
import { ScrapingService } from '@/application/service/ScrapingService'
import { Scraping } from './scrapingService/ScrapingService'
import AbstractTaxPersonService from '@domain/taxPerson/TaxPersonService'
import TaxPersonRepository from '@domain/taxPerson/TaxPersonRepository'
import { TaxPersonApi } from '@domain/taxPerson/TaxPersonApi'
import { GetScrapingTaxPersonService } from '@/application/service/GetScrapingTaxPersonServic'
import { GetScrapingTaxPerson } from './getScrapingTaxPerson/GetScrapingTaxPerson'
import type BitacoraRepository from '@domain/worklog/BitacoraRepository'
import { PrismaBitacoraRepository } from './repositories/prisma/PrismaBitacoraRepository'
import { BitacoraResolvers } from '@api/graphql/bitacora/BitacoraResolvers'
import AbstractBitacoraService from '@domain/worklog/AbstractBitacoraService'
import { InvitationResolvers } from '@api/graphql/invitation/InvitationResolvers'
import { PrismaInvitationRepository } from './repositories/prisma/PrismaInvitationRepository'
import InvitationRepository from '@domain/invitation/InvitationRepository'
import AbstractInvitationService from '@domain/invitation/InvitationService'
import { TaxPdfPersonResolver } from '@api/graphql/TaxPdfPerson/TaxPdfPersonResolver'
import AbstractProductService from '@domain/product/ProductService'
import { ProductService } from '@service/ProductService'
import { ProductResolvers } from '@api/graphql/product/ProductResolvers'
import { BitacoraService } from '@service/BitacoraService'
import { QuoteService } from '@service/QuoteService'
import { InvitationService } from '@service/InvitationService'

const container = new Container()

container.bind(ApolloServer).toSelf().inSingletonScope()
container.bind(TaskManager).toSelf()

// Resolvers
container.bind(LeadResolvers).toSelf()
container.bind(QuoteResolvers).toSelf()
container.bind(OfferResolvers).toSelf()
container.bind(UserResolvers).toSelf()
container.bind(ParamHeaderResolvers).toSelf()
container.bind(InventoryResolvers).toSelf()
container.bind(SlotResolvers).toSelf()
container.bind(TaskResolvers).toSelf()
container.bind(TaxPersonResolver).toSelf()
container.bind(TaxPdfPersonResolver).toSelf()
container.bind(ApplicationResolvers).toSelf()
container.bind(ApplicationChecklistResolvers).toSelf()
container.bind(PersonResolvers).toSelf()
container.bind(ProspectResolvers).toSelf()
container.bind(KycResolvers).toSelf()
container.bind(ClientResolvers).toSelf()
container.bind(TestResolvers).toSelf()
container.bind(LeasingResolvers).toSelf()
container.bind(PersonRegisResolvers).toSelf()
container.bind(VehicleInventoryResolvers).toSelf()
container.bind(PersonUpdateResolvers).toSelf()
container.bind(QuoteSmartItResolvers).toSelf()
container.bind(VehicleReservationResolvers).toSelf()
container.bind(ContractResolvers).toSelf()
container.bind(PaymentValidationResolvers).toSelf()
container.bind(DeliveryResolvers).toSelf()
container.bind(ContractSigningResolvers).toSelf()
container.bind(PendingDocumentsResolvers).toSelf()
container.bind(ConversationResolvers).toSelf()
container.bind(DeviceTokensResolvers).toSelf()
container.bind(IncidentResolvers).toSelf()
container.bind(VehicleResolvers).toSelf()
container.bind(BitacoraResolvers).toSelf()
container.bind(InvitationResolvers).toSelf()
container.bind(ProductResolvers).toSelf()

// Services
container.bind<LoggingService>(DI.LoggingService).to(ConsoleLogger).inSingletonScope()
container.bind<NotificationService>(DI.NotificationService).to(ChatwootNotification).inSingletonScope()
container.bind<ConversationService>(DI.ConversationService).to(ChatwootConversation).inSingletonScope()
container.bind<UberService>(DI.UberService).to(UberAPI).inSingletonScope()
container.bind<ScoringService>(DI.ScoringService).to(ScoringNodeRed).inSingletonScope()
container.bind<AuthService>(DI.AuthService).to(NextAuthService).inSingletonScope()
container.bind<ExternalAuthService>(DI.ExternalAuthService).to(ExternalApiAuthJWT).inSingletonScope()
container.bind<ContentService>(DI.ContentService).to(PaperlessAPI).inSingletonScope() // TODO implement multiple
container.bind<MeetingService>(DI.MeetingService).to(JitsiMeeting).inSingletonScope()
container.bind<ParseService>(DI.ParseService).to(CustomParser).inSingletonScope()
container.bind<DateService>(DI.DateService).to(MomentDateService).inSingletonScope()
container.bind<AuditService>(DI.AuditService).to(MongoDBAudit).inSingletonScope()
container.bind<TrackerService>(DI.TrackerService).to(TrackerGraphile).inSingletonScope()
container.bind<AlarmService>(DI.AlarmService).to(AlarmGraphile).inSingletonScope()
container.bind<AnalyticsService>(DI.AnalyticsService).to(AnalyticsGraphile).inSingletonScope()
container.bind<FinancialService>(DI.FinancialService).to(FinancialSmartIt).inSingletonScope()
container.bind<GetTaxPersonService>(DI.GetTaxPersonService).to(GetDataTaxPerson).inSingletonScope()
container.bind<GetScrapingTaxPersonService>(DI.GetScrapingTaxPersonService).to(GetScrapingTaxPerson).inSingletonScope()
container.bind<ScrapingService>(DI.ScrapingService).to(Scraping).inSingletonScope()

// Domain Services
container.bind<AbstractLeadService>(DI.LeadService).to(LeadService).inSingletonScope()
container.bind<AbstractQuoteService>(DI.QuoteService).to(QuoteService).inSingletonScope()
container.bind<AbstractUserService>(DI.UserService).to(UserService).inSingletonScope()
container.bind<AbstractOfferService>(DI.OfferService).to(OfferService).inSingletonScope()
container.bind<AbstractParamHeaderService>(DI.ParamHeaderService).to(ParamHeaderService).inSingletonScope()
container.bind<AbstractInventoryService>(DI.InventoryService).to(InventoryService).inSingletonScope()
container.bind<AbstractSlotService>(DI.SlotService).to(SlotService).inSingletonScope()
container.bind<AbstractTaskService>(DI.TaskService).to(TaskService).inSingletonScope()
container.bind<AbstractApplicationService>(DI.ApplicationService).to(ApplicationService).inSingletonScope()
container
  .bind<AbstractApplicationChecklistService>(DI.ApplicationChecklistService)
  .to(ApplicationChecklistService)
  .inSingletonScope()
container.bind<AbstractPersonService>(DI.PersonService).to(PersonService).inSingletonScope()
container.bind<AbstractTaxPersonService>(DI.TaxPersonService).to(TaxPersonService).inSingletonScope()
container.bind<AbstractProspectService>(DI.ProspectService).to(ProspectService).inSingletonScope()
container.bind<AbstractKycService>(DI.KycService).to(KycService).inSingletonScope()
container.bind<AbstractClientService>(DI.ClientService).to(ClientService).inSingletonScope()
container.bind<AbstractContentQueueService>(DI.ContentQueueService).to(ContentQueueService).inSingletonScope()
container.bind<AbstractTripService>(DI.TripService).to(TripService).inSingletonScope()
container.bind<AbstractLeasingService>(DI.LeasingService).to(LeasingService).inSingletonScope()
container.bind<AbstractPersonRegiService>(DI.PersonRegisService).to(PersonRegisService).inSingletonScope()
container.bind<AbstractVehicleInventoryService>(DI.VehicleInventoryService).to(VehicleInventoryService)
container.bind<AbstractPersonUpdateService>(DI.PersonUpdateService).to(PersonUpdateService)
container.bind<AbstractQuoteSmartItService>(DI.QuoteSmartItService).to(QuoteSmartItService)
container.bind<AbstractVehicleReservationService>(DI.VehicleReservationService).to(VehicleReservationService)
container.bind<AbstractContractService>(DI.ContractService).to(ContractService)
container.bind<AbstractPaymentValidationService>(DI.PaymentValidationService).to(PaymentValidationService)
container.bind<AbstractDeliveryService>(DI.DeliveryService).to(DeliveryService)
container.bind<AbstractContractSigningService>(DI.ContractSigningService).to(ContractSigningService)
container.bind<AbstractPendingDocumentsService>(DI.PendingDocumentsService).to(PendingDocumentsService)
container.bind<AbstractDeviceTokenService>(DI.DeviceTokenService).to(DeviceTokenService).inSingletonScope()
container.bind<IncidentSmartItService>(DI.IncidentApi).to(IncidentApi).inSingletonScope()
container
  .bind<AbstractUberRegistrySmartItService>(DI.UberRegistrySmartItService)
  .to(UberRegistrySmartItService)
  .inSingletonScope()
container.bind<AbstractVehicleSmartItService>(DI.VehicleSmartItService).to(VehicleSmartItService).inSingletonScope()
container.bind<AbstractBitacoraService>(DI.BitacoraService).to(BitacoraService).inSingletonScope()
container.bind<AbstractInvitationService>(DI.InvitationService).to(InvitationService).inSingletonScope()
container.bind<AbstractProductService>(DI.ProductService).to(ProductService).inSingletonScope()

// Repositories
container.bind<LeadRepository>(DI.LeadRepository).to(PrismaLeadRepository)
container.bind<QuoteRepository>(DI.QuoteRepository).to(PrismaQuoteRepository)
container.bind<OfferRepository>(DI.OfferRepository).to(PrismaOfferRepository)
container.bind<ProductRepository>(DI.ProductRepository).to(PrismaProductRepository)
container.bind<ParamHeaderRepository>(DI.ParamHeaderRepository).to(PrismaParamHeaderRepository)
container.bind<SlotRepository>(DI.SlotRepository).to(PrismaSlotRepository)
container.bind<UserRepository>(DI.UserRepository).to(PrismaUserRepository)
container.bind<TaskRepository>(DI.TaskRepository).to(PrismaTaskRepository)
container.bind<ApplicationRepository>(DI.ApplicationRepository).to(PrismaApplicationRepository)
container
  .bind<ApplicationChecklistRepository>(DI.ApplicationChecklistRepository)
  .to(PrismaApplicationChecklistRepository)
container.bind<AddressRepository>(DI.AddressRepository).to(PrismaAddressRepository)
container.bind<PersonRepository>(DI.PersonRepository).to(PersonApi)
container.bind<ContentQueueRepository>(DI.ContentQueueRepository).to(PrismaContentQueueRepository)
container.bind<VehicleRepository>(DI.VehicleRepository).to(PrismaVehicleRepository)
container.bind<TripRepository>(DI.TripRepository).to(PrismaTripRepository)
container.bind<LeasingRepository>(DI.LeasingRepository).to(PrismaLeasingRepository)
container.bind<PersonRegiRepository>(DI.PersonRegiRepository).to(PersonResgisApi)
container.bind<VehicleInventoryRepository>(DI.VehicleInventoryRepository).to(VehicleInventoryApi)
container.bind<PersonUpdateRepository>(DI.PersonUpdateRepository).to(PersonUpdateApi)
container.bind<QuoteSmartItRepository>(DI.QuoteSmartItRepository).to(QuoteSmartItApi)
container.bind<VehicleReservationRepository>(DI.VehicleReservationRepository).to(VehicleReservationApi)
container.bind<ContractRepository>(DI.ContractRepository).to(ContractApi)
container.bind<PaymentValidationRepository>(DI.PaymentValidationRepository).to(PaymentValidationApi)
container.bind<DeliveryRepository>(DI.DeliveryRepository).to(DeliveryApi)
container.bind<ContractSigningRepository>(DI.ContractSigningRepository).to(ContractSigningApi)
container.bind<TaxPersonRepository>(DI.TaxPersonRepository).to(TaxPersonApi)
container.bind<ProspectRepository>(DI.ProspectRepository).to(PrismaProspectRepository)
container.bind<ProspectActivityRepository>(DI.ProspectActivityRepository).to(PrismaProspectActivityRepository)
container.bind<PendingDocumentsRepository>(DI.PendingDocumentsRepository).to(PendingDocumentsApi)
container.bind<DeviceTokenRepository>(DI.DeviceTokenRepository).to(PrismaDeviceTokenRepository)
container.bind<UberRegistrySmartItRepository>(DI.UberRegistrySmartItRepository).to(UberRegistryApi)
container.bind<VehicleSmartItRepository>(DI.VehicleSmartItRepository).to(VehicleSmartItApi)
container.bind<BitacoraRepository>(DI.BitacoraRepository).to(PrismaBitacoraRepository)
container.bind<InvitationRepository>(DI.InvitationRepository).to(PrismaInvitationRepository)

export default container
