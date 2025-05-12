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
      'Authorization, Accept,Origin,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,X-Auth-Token,X-XSRF-TOKEN,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range',
    )
    response.headers.append(
      'Access-Control-Request-Headers',
      'Authorization, Accept,Origin,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,X-Auth-Token,X-XSRF-TOKEN,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range',
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
        
        // Rutas públicas - siempre permitir acceso
        if (req.nextUrl.pathname.startsWith('/api/graphql/public') ||
            req.nextUrl.pathname.startsWith('/api/graphql') || 
            req.nextUrl.pathname.startsWith('/api/external/graphql') ||
            req.nextUrl.pathname.startsWith("/api/auth") ||
            req.nextUrl.pathname.startsWith("/api/v1/kyc") ||
            req.nextUrl.pathname.startsWith("/api/v1/documents") ||
            req.nextUrl.pathname.startsWith("/api/v1/fuzzy") ||
            req.nextUrl.pathname.startsWith("/api/v1/curp") ||
            req.nextUrl.pathname.startsWith("/api/v1/lista-nominal") ||
            req.nextUrl.pathname.startsWith("/api/v1/timestamp") ||
            req.nextUrl.pathname.startsWith("/api/public/graphql") ||
            req.nextUrl.pathname.startsWith("/api/facetec") ||
            req.nextUrl.pathname.startsWith("/facetec")) {
          return true
        }
        
        // Para todas las demás rutas, verificar si hay un token válido
        return !!token
      },
    },
  },
)