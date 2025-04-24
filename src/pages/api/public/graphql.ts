import 'reflect-metadata'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { NextRequest } from 'next/server'
import container from '@infrastructure/inversify.config'
import { ApolloServer } from '@infrastructure/graphql/apollo/ApolloServer'
import { ApiPublicContext } from '@api/shared/Api'
import allowCors from '@/utils/cors'

// Obtener una referencia al servidor Apollo
const apolloServer = container.get(ApolloServer).getServer();

// Usar la misma instancia de servidor para todas las peticiones 
const handler = startServerAndCreateNextHandler<NextRequest>(apolloServer, {
  context: async (req: NextRequest): Promise<ApiPublicContext> => {
    const headers = req.headers as unknown as Dict<string>

    return {
      headers,
    }
  },
})

export default allowCors(handler)
