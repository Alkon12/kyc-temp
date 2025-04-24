import 'reflect-metadata'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { NextRequest } from 'next/server'
import container from '@infrastructure/inversify.config'
import { ApolloServer } from '@infrastructure/graphql/apollo/ApolloServer'
import { ApiExternalContext } from '@api/shared/Api'
import { ExternalAuthService } from '@/application/service/ExternalAuthService'
import { DI } from '@infrastructure'
import allowCors from '@/utils/cors'

// Obtener una referencia al servidor Apollo
const apolloServer = container.get(ApolloServer).getServer();

// Usar la misma instancia de servidor para todas las peticiones
const handler = startServerAndCreateNextHandler<NextRequest>(apolloServer, {
  context: async (req: NextRequest): Promise<ApiExternalContext> => {
    const headers = req.headers as unknown as Dict<string>
    const externalApiAuthService = container.get<ExternalAuthService>(DI.ExternalAuthService)
    const token = await externalApiAuthService.getToken(headers)
    const userId = externalApiAuthService.getUserId(token)

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
