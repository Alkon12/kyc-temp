import { nextAuthOptions } from '@infrastructure/auth/nextAuth/NextAuth'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(request) {
    const response = NextResponse.next()

    // const logger = container.get<LoggingService>(DI.LoggingService)
    // logger.log(LoggingModule.AUTH, 'Middleware URL', JSON.stringify(request.nextUrl))

    // add the CORS headers to the response
    response.headers.append('Access-Control-Allow-Credentials', 'false')
    response.headers.append('Access-Control-Allow-Origin', '*')
    response.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS')
    response.headers.append(
      'Access-Control-Allow-Headers',
      'Authorization, Accept,Origin,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,X-Auth-Token,X-XSRF-TOKEN,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range',
    )
    response.headers.append(
      'Access-Control-Request-Headers',
      'Authorization, Accept,Origin,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,X-Auth-Token,X-XSRF-TOKEN,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range',
    )

    return response
  },
  {
    jwt: {
      decode: nextAuthOptions.jwt?.decode,
    },
    callbacks: {
      authorized: ({ req, token }) => {
        // const logger = container.get<LoggingService>(DI.LoggingService)

        // logger.log(LoggingModule.AUTH, 'Middleware request method', req.method)

        const isPreflight = req.method === 'OPTIONS'
        if (isPreflight) {
          return true
        }

        // logger.log(LoggingModule.AUTH, 'Middleware Token', token)

        if (req.nextUrl.pathname.startsWith('/api/graphql/public')) {
          return true
        }

        if (req.nextUrl.pathname.startsWith('/api/external/graphql')) {
          return true
        }

        if (req.nextUrl.pathname.startsWith('/api/graphql') && token === null) {
          return false
        }

        return true
      },
    },
  },
)
