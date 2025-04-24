import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { NextRequest } from 'next/server'
import container from '@infrastructure/inversify.config'
import { ApolloServer } from '@infrastructure/graphql/apollo/ApolloServer'
import { ApiContext } from '@api/shared/Api'
import { AuthService } from '@/application/service/AuthService'
import { DI } from '@infrastructure'
import allowCors from '@/utils/cors'
import { LoggingModule, LoggingService } from '@/application/service/LoggingService'

// Obtener una referencia al servidor Apollo 
const apolloServer = container.get(ApolloServer).getServer();

// Usar la misma instancia de servidor para todas las peticiones
const handler = startServerAndCreateNextHandler<NextRequest>(apolloServer, {
  context: async (request: NextRequest): Promise<ApiContext> => {
    const logger = container.get<LoggingService>(DI.LoggingService)

    const headers = request.headers as unknown as Dict<string> // TODO be careful some props are not retrieved but displayed in console log
    const authService = container.get<AuthService>(DI.AuthService)
    const token = await authService.getToken(request)
    const userId = await authService.getUserId(request)

    logger.log(LoggingModule.AUTH, 'GraphQL API Context token', token)
    logger.log(LoggingModule.AUTH, 'GraphQL API Context userId', userId)

    return {
      headers,
      token,
      userId,
      user: token.user,
    }
  },
})

// export default handler
export default allowCors(handler)
