import prisma from '@client/providers/PrismaClient'
import { RequestInternal } from 'next-auth'

export const smartitCredentials = {
  email: { label: 'email', type: 'text' },
  password: { label: 'password', type: 'password' },
}

const getByName = async (name: string) => {
  //TODO: Use DI
  const user = await prisma.user.findFirst({
    where: {
      name: name,
    },
    include: {
      quotes: {
        include: {
          offers: {
            include: {
              product: true,
            },
          },
        },
      },
      applications: true,
      groups: {
        include: {
          group: true,
        },
      },
      assignedTasks: true,
    },
  })
  return user
}

export async function authSmartITAuthorize(
  credentials: Record<'email' | 'password', string> | undefined,
  req: Pick<RequestInternal, 'body' | 'query' | 'headers' | 'method'>,
) {
  //const userService = container.get<UserService>(DI.UserService)

  console.log('88888 NEXTAUTH SMART IT PROVIDER CREDENTIALS')
  console.log('CREDENTIALS:', credentials)

  if (!credentials?.email || !credentials?.password) {
    throw new Error('Invalid credentials')
  }

  console.log('authSmartITAuthorize SMARTIT ENDPOINT:', process.env.NEXT_PUBLIC_URL_SMARTIT + 'usuarios/login')
  // POST SMART IT LOGIN SERVICE
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL_SMARTIT}usuarios/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: credentials.email,
      password: credentials.password,
      secret: process.env.SMARTIT_API_SECRET_KEY,
    }),
  })

  console.log('SMART IT RESPONSE', response)
  if (response.status === 500) {
    throw new Error('Auth Service Unavailable!')
  }
  if (response.status === 204) {
    //throw new Error("User not found!");
    // SEARCH DB USER
    const userdb = await prisma.user.findUnique({
      where: {
        email: credentials.email,
      },
    })

    // TODO: VALID DB HASHED PASSWORD

    if (!userdb) {
      throw new Error('Invalid credentials')
    }

    return userdb
  }
  const usuario = await response.json()
  console.log('[usuario]', usuario)
  if (response.status === 401) {
    //Unauthorized validate reason ?
    console.log('[USUARIO RESPONSE]', usuario.user)
    if (usuario.user !== undefined) {
      // TODO: Valid blocked reason
      throw new Error('Your account has been blocked!')
    } else {
      throw new Error('Invalid password!')
    }
  }

  //let userRent = await userService.getByName(usuario.user.username)
  let userRent = await getByName(usuario.user.username)
  if (!userRent) {
    throw new Error('Auth Service Unavailable! [User not found! PSQL]')
  }
  console.log('[USER - AUTOFINRENT]', userRent)

  const user = {
    id: userRent.id,
    //id:usuario.id,
    name: `${usuario.user.nombre} ${usuario.user.apellidoPaterno} ${usuario.user.apellidoMaterno}`,
    firstName: usuario.user.nombre,
    lastName: `${usuario.user.apellidoPaterno} ${usuario.user.apellidoMaterno}`,
    email: usuario.user.mail,
    image: null,
    picture: null,
    phoneNumber: null,
    uberDriverId: null,
    uberRating: null,
    uberPromoCode: null,
    uberActivationStatus: null,
    uberEarningsRetentionActive: false,
    uberPartnerRole: null,
    // TODO: User permissions
  }

  return user
}
