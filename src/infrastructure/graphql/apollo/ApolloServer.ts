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
import { ApolloLoggingPlugin } from './ApolloLoggingPlugin'
import { UserResolvers } from '@api/graphql/user/UserResolvers'
import { TestResolvers } from '@api/graphql/test/TestResolvers'
import { KycResolvers } from '@api/graphql/kyc/KycResolvers'
import { VerificationLinkResolvers } from '@api/graphql/verification-link/VerificationLinkResolvers'
import { DocumentResolvers } from '@api/graphql/document/DocumentResolvers'
import { CompanyResolvers } from '@api/graphql/company/CompanyResolvers'

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
      UserSchema,
      TestSchema,
      KycSchema,
      VerificationLinkSchema,
      DocumentSchema,
      CompanySchema,
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
