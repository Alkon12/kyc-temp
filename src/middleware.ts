import { nextAuthOptions } from '@infrastructure/auth/nextAuth/NextAuth'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(request) {
    const response = NextResponse.next()
    
    // Añadir encabezados CORS
    response.headers.append('Access-Control-Allow-Credentials', 'false')
    response.headers.append('Access-Control-Allow-Origin', '*')
    response.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS')
    response.headers.append(
      'Access-Control-Allow-Headers',
      'Authorization, Accept,Origin,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,X-Auth-Token,X-XSRF-TOKEN,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range,x-api-key',
    )
    response.headers.append(
      'Access-Control-Request-Headers',
      'Authorization, Accept,Origin,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,X-Auth-Token,X-XSRF-TOKEN,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range,x-api-key',
    )
    
    return response
  },
  {
    pages: {
      signIn: "/login",
    },
    jwt: {
      decode: nextAuthOptions.jwt?.decode,
    },
    callbacks: {
      authorized: ({ req, token }) => {
        // Permitir solicitudes PREFLIGHT (OPTIONS)
        if (req.method === 'OPTIONS') {
          return true
        }

        // Rutas protegidas exactamente
        const protectedPaths = ['/', '/companies', '/settings', '/users', '/verificaciones']
        const pathname = req.nextUrl.pathname
        if (protectedPaths.includes(pathname)) {
          return !!token
        }

        // El resto es público
        return true
      },
    },
  },
)