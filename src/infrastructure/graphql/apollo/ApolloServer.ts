import { injectable } from 'inversify'
import { ApolloServer as ApolloServerInstance } from '@apollo/server'
import container from '@infrastructure/inversify.config'
import merge from 'lodash.merge'
import { BaseSchema } from '@api/graphql/base'
import { UserSchema } from '@api/graphql/user'
import { TestSchema } from '@api/graphql/test'
import { KycSchema } from '@api/graphql/kyc'
import { VerificationLinkSchema } from '@api/graphql/verification-link'
import { DocumentSchema } from '@api/graphql/document'
import { CompanySchema } from '@api/graphql/company'
import { FacetecResultSchema } from '@api/graphql/facetec-result'
import { ExternalVerificationSchema } from '@api/graphql/external-verification'
import { ApolloLoggingPlugin } from './ApolloLoggingPlugin'
import { UserResolvers } from '@api/graphql/user/UserResolvers'
import { TestResolvers } from '@api/graphql/test/TestResolvers'
import { KycResolvers } from '@api/graphql/kyc/KycResolvers'
import { VerificationLinkResolvers } from '@api/graphql/verification-link/VerificationLinkResolvers'
import { DocumentResolvers } from '@api/graphql/document/DocumentResolvers'
import { CompanyResolvers } from '@api/graphql/company/CompanyResolvers'
import { FacetecResultResolvers } from '@api/graphql/facetec-result/FacetecResultResolvers'
import { ExternalVerificationResolvers } from '@api/graphql/external-verification/ExternalVerificationResolvers'

// Variable global para almacenar la instancia del servidor
// Debe estar fuera de la clase para evitar problemas de tipo
let apolloServerInstance: any = null;
let apolloServerInitialized = false;

@injectable()
export class ApolloServer {
  // @inject(DI.LoggingService) private _logger!: LoggingService

  private _cors: { enabled: boolean; allowedOrigin: string[] }
  private _apolloServer: any

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

    // Si ya tenemos una instancia, reusarla
    if (apolloServerInitialized) {
      console.log('Reutilizando instancia existente de ApolloServer');
      this._apolloServer = apolloServerInstance;
      return;
    }

    console.log('Creando nueva instancia de ApolloServer');
    // Si no hay instancia, crearla
    const mergedTypeDefs = [BaseSchema].concat([
      UserSchema,
      TestSchema,
      KycSchema,
      VerificationLinkSchema,
      DocumentSchema,
      CompanySchema,
      FacetecResultSchema,
      ExternalVerificationSchema,
    ])
    const mergedResolvers = merge(
      [],
      [
        container.get(UserResolvers).build(),
        container.get(TestResolvers).build(),
        container.get(KycResolvers).build(),
        container.get(VerificationLinkResolvers).build(),
        container.get(DocumentResolvers).build(),
        container.get(CompanyResolvers).build(),
        container.get(FacetecResultResolvers).build(),
        container.get(ExternalVerificationResolvers).build(),
      ],
    )

    const newServer = new ApolloServerInstance({
      resolvers: mergedResolvers,
      typeDefs: mergedTypeDefs,
      introspection: process.env.NODE_ENV !== 'production',
      plugins: [ApolloLoggingPlugin],
    });

    // Guardar la instancia para reutilizarla
    apolloServerInstance = newServer;
    apolloServerInitialized = true;
    this._apolloServer = newServer;
  }

  public getServer() {
    return this._apolloServer
  }
}
