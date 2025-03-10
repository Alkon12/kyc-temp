import { injectable } from 'inversify'
import { ApolloServer as ApolloServerInstance } from '@apollo/server'
import container from '@infrastructure/inversify.config'
import merge from 'lodash.merge'
import { BaseSchema } from '@api/graphql/base'
import { UserSchema } from '@api/graphql/user'
import { ApolloLoggingPlugin } from './ApolloLoggingPlugin'
import { UserResolvers } from '@api/graphql/user/UserResolvers'

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
    ])
    const mergedResolvers = merge(
      [],
      [
        container.get(UserResolvers).build(),
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
