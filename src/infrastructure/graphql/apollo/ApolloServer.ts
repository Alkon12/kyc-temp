import { injectable } from 'inversify'
import { ApolloServer as ApolloServerInstance } from '@apollo/server'
import container from '@infrastructure/inversify.config'
import merge from 'lodash.merge'

import { ApplicationSchema } from '@api/graphql/application'
import { BaseSchema } from '@api/graphql/base'
import { InventorySchema } from '@api/graphql/inventory'
import { LeadSchema } from '@api/graphql/lead'
import { LeasingSchema } from '@api/graphql/leasing'
import { LocationSchema } from '@api/graphql/location'
import { OfferSchema } from '@api/graphql/offer'
import { ParamDetailSchema } from '@api/graphql/paramdetail'
import { ParamHeaderSchema } from '@api/graphql/paramheader'
import { ProductSchema } from '@api/graphql/product'
import { ProductResolvers } from '@api/graphql/product/ProductResolvers'
import { QuoteSchema } from '@api/graphql/quote'
import { SlotSchema } from '@api/graphql/slot'
import { TaskSchema } from '@api/graphql/task'
import { UserSchema } from '@api/graphql/user'
import { VehicleSchema } from '@api/graphql/vehicle'
import { VehicleResolvers } from '@api/graphql/vehicle/VehicleResolvers'
import { ApolloLoggingPlugin } from './ApolloLoggingPlugin'
import { ApplicationResolvers } from '@api/graphql/application/ApplicationResolvers'
import { InventoryResolvers } from '@api/graphql/inventory/InventoryResolvers'
import { LeadResolvers } from '@api/graphql/lead/LeadResolvers'
import { OfferResolvers } from '@api/graphql/offer/OfferResolvers'
import { ParamHeaderResolvers } from '@api/graphql/paramheader/ParamHeaderResolver'
import { QuoteResolvers } from '@api/graphql/quote/QuoteResolvers'
import { TaskResolvers } from '@api/graphql/task/TaskResolvers'
import { UserResolvers } from '@api/graphql/user/UserResolvers'
import { PersonSchema } from '@api/graphql/person'
import { PersonResolvers } from '@api/graphql/person/PersonResolvers'
import { ProspectSchema } from '@api/graphql/prospect'
import { ProspectResolvers } from '@api/graphql/prospect/ProspectResolvers'
import { KycSchema } from '@api/graphql/kyc'
import { KycResolvers } from '@api/graphql/kyc/KycResolvers'
import { ClientSchema } from '@api/graphql/client'
import { ClientResolvers } from '@api/graphql/client/ClientResolvers'
import { ApplicationChecklistSchema } from '@api/graphql/applicationChecklist'
import { ApplicationChecklistResolvers } from '@api/graphql/applicationChecklist/ApplicationChecklistResolvers'
import { SlotResolvers } from '@api/graphql/slot/SlotResolvers'
import { TestSchema } from '@api/graphql/test'
import { TestResolvers } from '@api/graphql/test/TestResolvers'
import { LeasingResolvers } from '@api/graphql/leasing/LeasingResolvers'
import { PersonRegiSchema } from '@api/graphql/personRegis'
import { PersonRegisResolvers } from '@api/graphql/personRegis/PersonRegisResolvers'
import { VehicleInventoryResolvers } from '@api/graphql/inventorySmarIt/InventorySmartItResolvers'
import { VehicleInventorySchema } from '@api/graphql/inventorySmarIt'
import { PersonUpdateResolvers } from '@api/graphql/personUpdate/PersonUpdateResolvers'
import { PersonUpdateSchema } from '@api/graphql/personUpdate'
import { QuoteSmartItResolvers } from '@api/graphql/quoteSmarIt/QuoteSmartItResolvers'
import { QuoteSmartItSchema } from '@api/graphql/quoteSmarIt'
import { VehicleReservationResolvers } from '@api/graphql/vehicleReservation/VehicleReservationResolvers'
import { VehicleReservationSchema } from '@api/graphql/vehicleReservation'
import { ContractSchema } from '@api/graphql/contract'
import { ContractResolvers } from '@api/graphql/contract/ContractResolvers'
import { PaymentValidationSchema } from '@api/graphql/paymentValidation'
import { PaymentValidationResolvers } from '@api/graphql/paymentValidation/PaymentValidationResolvers'
import { DeliverySchema } from '@api/graphql/delivery'
import { DeliveryResolvers } from '@api/graphql/delivery/DeliveryResolvers'
import { ContractSigningSchema } from '@api/graphql/contractSigning'
import { ContractSigningResolvers } from '@api/graphql/contractSigning/ContractSigningResolvers'
import { PendingDocumentsSchema } from '@api/graphql/pendingDocuments'
import { PendingDocumentsResolvers } from '@api/graphql/pendingDocuments/PendingDocumentsResolvers'
import { ConversationSchema } from '@api/graphql/conversation'
import { ConversationResolvers } from '@api/graphql/conversation/ConversationResolvers'
import { DeviceTokenSchema } from '@api/graphql/deviceTokens'
import { DeviceTokensResolvers } from '@api/graphql/deviceTokens/DeviceTokensResolvers'
import { IncidentSchema } from '@api/graphql/incident'
import { IncidentResolvers } from '@api/graphql/incident/IncidentResolvers'
import { taxPersonSchema } from '@api/graphql/taxPerson'
import { TaxPersonResolver } from '@api/graphql/taxPerson/TaxPersonResolver'
import { BitacoraSchema } from '@api/graphql/bitacora'
import { BitacoraResolvers } from '@api/graphql/bitacora/BitacoraResolvers'
import { InvitationSchema } from '@api/graphql/invitation'
import { InvitationResolvers } from '@api/graphql/invitation/InvitationResolvers'
import { TaxPdfPersonResolver } from '@api/graphql/TaxPdfPerson/TaxPdfPersonResolver'
import { taxPdfPersonSchema } from '@api/graphql/TaxPdfPerson'

@injectable()
export class ApolloServer {
  // @inject(DI.LoggingService) private _logger!: LoggingService

  private _cors: { enabled: boolean; allowedOrigin: string[] }
  private _apolloServer

  // constructor(typeDefs: any, resolvers: any) {

  constructor() {
    const allowedOrigin = process.env.CORS_ALLOWED_ORIGIN
    if (typeof allowedOrigin === 'string') {
      this._cors = {
        enabled: true,
        allowedOrigin: allowedOrigin.toLowerCase().split(','),
      }
    } else {
      this._cors = {
        enabled: false,
        allowedOrigin: [],
      }
    }

    const mergedTypeDefs = [BaseSchema].concat([
      LocationSchema,
      LeadSchema,
      taxPersonSchema,
      taxPdfPersonSchema,
      UserSchema,
      ProductSchema,
      QuoteSchema,
      OfferSchema,
      ApplicationSchema,
      ApplicationChecklistSchema,
      VehicleSchema,
      ParamHeaderSchema,
      ParamDetailSchema,
      InventorySchema,
      SlotSchema,
      InventorySchema,
      TaskSchema,
      LeasingSchema,
      PersonSchema,
      PersonSchema,
      ProspectSchema,
      KycSchema,
      ClientSchema,
      TestSchema,
      PersonRegiSchema,
      VehicleInventorySchema,
      PersonUpdateSchema,
      QuoteSmartItSchema,
      VehicleReservationSchema,
      ContractSchema,
      PaymentValidationSchema,
      DeliverySchema,
      ContractSigningSchema,
      PendingDocumentsSchema,
      ConversationSchema,
      DeviceTokenSchema,
      IncidentSchema,
      BitacoraSchema,
      InvitationSchema,
    ])
    const mergedResolvers = merge(
      [],
      [
        container.get(LeadResolvers).build(),
        container.get(QuoteResolvers).build(),
        container.get(UserResolvers).build(),
        container.get(OfferResolvers).build(),
        container.get(LeadResolvers).build(),
        container.get(ParamHeaderResolvers).build(),
        container.get(InventoryResolvers).build(),
        container.get(SlotResolvers).build(),
        container.get(ParamHeaderResolvers).build(),
        container.get(InventoryResolvers).build(),
        container.get(TaskResolvers).build(),
        container.get(ApplicationResolvers).build(),
        container.get(PersonResolvers).build(),
        container.get(ApplicationResolvers).build(),
        container.get(ApplicationChecklistResolvers).build(),
        container.get(PersonResolvers).build(),
        container.get(ProspectResolvers).build(),
        container.get(KycResolvers).build(),
        container.get(ClientResolvers).build(),
        container.get(TestResolvers).build(),
        container.get(TaxPersonResolver).build(),
        container.get(TaxPdfPersonResolver).build(),
        container.get(LeasingResolvers).build(),
        container.get(PersonRegisResolvers).build(),
        container.get(VehicleInventoryResolvers).build(),
        container.get(PersonUpdateResolvers).build(),
        container.get(QuoteSmartItResolvers).build(),
        container.get(VehicleReservationResolvers).build(),
        container.get(ContractResolvers).build(),
        container.get(PaymentValidationResolvers).build(),
        container.get(DeliveryResolvers).build(),
        container.get(ContractSigningResolvers).build(),
        container.get(PendingDocumentsResolvers).build(),
        container.get(ConversationResolvers).build(),
        container.get(DeviceTokensResolvers).build(),
        container.get(IncidentResolvers).build(),
        container.get(VehicleResolvers).build(),
        container.get(BitacoraResolvers).build(),
        container.get(InvitationResolvers).build(),
        container.get(ProductResolvers).build(),
      ],
    )

    this._apolloServer = new ApolloServerInstance({
      resolvers: mergedResolvers,
      typeDefs: mergedTypeDefs,
      introspection: process.env.NODE_ENV !== 'production',
      plugins: [ApolloLoggingPlugin],
    })
  }

  public getServer() {
    return this._apolloServer
  }
}
