import { NextAuthOptions, User } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '@client/providers/PrismaClient'
import CredentialsProvider from 'next-auth/providers/credentials'
import { authCredentialsAuthorize, credentials } from '@infrastructure/auth/nextAuth/providers/credentials'
import { JWT } from 'next-auth/jwt'
import { UnauthorizedError } from '@domain/error'
import * as jose from 'jose'

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: credentials,
      authorize: authCredentialsAuthorize,
    }),
  ],
  pages:{
    signIn: "/loginerror",
    error: "/loginerror"
  },
  callbacks: {
    async jwt(context) {
      // console.log('77777 NextAuth JWT CONTEXT', context)
      console.log("UBER LOGIN SUCCESS")
      const { token, user, account, profile } = context

      if (user) {
        token.user = user
      }

      //throw new Error("Error al iniciar sesión")

      return token
    },
    async session(context) {
      // console.log('999999 NextAuth SESSION CONTEXT', context)
      const { session, token } = context
      const user = token.user as User

      if (session && user) {
        // Incluir el usuario básico primero
        session.user = user
        
        // Obtener grupos y roles del usuario desde Prisma
        const userData = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            groups: {
              include: {
                group: true
              }
            },
            userRoles: {
              include: {
                role: true
              }
            }
          }
        })
        
        if (userData) {
          // Añadir grupos y roles a la sesión
          session.user.groups = userData.groups.map(userGroup => ({
            id: userGroup.groupId,
            title: userGroup.group.title,
            assignedAt: userGroup.assignedAt.toISOString(),
          }))
          
          session.user.roles = userData.userRoles.map(userRole => ({
            id: userRole.roleId,
            roleName: userRole.role.roleName,
            companyId: userRole.companyId || null // Asegurarse que companyId sea null explícitamente si no existe
          }))
          
          console.log("Usuario con roles:", JSON.stringify(session.user.roles, null, 2))
        }
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  debug: true,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  logger: {
    error(code, metadata) {
      console.error(code, metadata)
    },
    warn(code) {
      console.warn(code)
    },
    debug(code, metadata) {
      console.debug(code, metadata)
    },
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    async encode(params): Promise<string> {
      // const logger = container.get<LoggingService>(DI.LoggingService)

      // logger.log(LoggingModule.AUTH, 'NextAuth encode', params)

      let payload = {}
      // const token = await container.get<AuthService>(DI.AuthService).signToken(params.token ?? {})
      if (params.token === undefined) {
        throw new UnauthorizedError('Access Token invalid')
      } else {
        payload = params.token
      }

      const alg = 'RS256'
      const pkcs8 = (process.env.EXTERNAL_API_JWT_PRIVATE_KEY as string).replace(/\\n/g, '\n')
      const privateKey = await jose.importPKCS8(pkcs8, alg)

      const token = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer('urn:example:issuer')
        .setAudience('urn:example:audience')
        .setExpirationTime('2h')
        .sign(privateKey)

      // console.log('8888 ENCODE PARAMS BBBB', token)

      return token
    },
    async decode(params): Promise<JWT | null> {
      // const logger = container.get<LoggingService>(DI.LoggingService)

      // logger.log(LoggingModule.AUTH, 'NextAuth decode', params)

      try {
        const alg = 'RS256'
        const spki = (process.env.EXTERNAL_API_JWT_PUBLIC_KEY as string).replace(/\\n/g, '\n')
        const publicKey = await jose.importSPKI(spki, alg)
        const { payload: decodedToken, protectedHeader } = await jose.jwtVerify(params.token ?? '', publicKey, {
          // issuer: 'urn:example:issuer',
          // audience: 'urn:example:audience',
        })

        // logger.log(LoggingModule.AUTH, 'NextAuth decode decoded Token', decodedToken)

        if (!decodedToken) {
          throw new UnauthorizedError('Access Token invalid')
        }

        return decodedToken as unknown as JWT
      } catch (error) {
        console.error('NextAuth decode decoded error', error)
        throw new UnauthorizedError('Access token format invalid')
      }
    },
  },
}
