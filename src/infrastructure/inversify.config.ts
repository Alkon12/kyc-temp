import 'reflect-metadata'

import { Container } from 'inversify'
import { DI } from '@infrastructure'
import { LoggingService } from '../application/service/LoggingService'
import { ApolloServer } from './graphql/apollo/ApolloServer'
import { UserResolvers } from '@api/graphql/user/UserResolvers'
import type UserRepository from '@domain/user/UserRepository'
import { PrismaUserRepository } from './repositories/prisma/PrismaUserRepository'
import AbstractUserService from '@domain/user/UserService'
import { UserService } from '@service/UserService'
import { NextAuthService } from './auth/nextAuth/NextAuthService'
import { AuthService } from '@/application/service/AuthService'
import { ExternalAuthService } from '@/application/service/ExternalAuthService'
import { ExternalApiAuthJWT } from './auth/externalApiAuth/ExternalApiAuthJWT'
import { ConsoleLogger } from './ConsoleLogger'
``

const container = new Container()

container.bind(ApolloServer).toSelf().inSingletonScope()

// Resolvers
container.bind(UserResolvers).toSelf()

// Services
container.bind<LoggingService>(DI.LoggingService).to(ConsoleLogger).inSingletonScope()
container.bind<AuthService>(DI.AuthService).to(NextAuthService).inSingletonScope()
container.bind<ExternalAuthService>(DI.ExternalAuthService).to(ExternalApiAuthJWT).inSingletonScope()

// Domain Services
container.bind<AbstractUserService>(DI.UserService).to(UserService).inSingletonScope()

// Repositories
container.bind<UserRepository>(DI.UserRepository).to(PrismaUserRepository)

export default container
