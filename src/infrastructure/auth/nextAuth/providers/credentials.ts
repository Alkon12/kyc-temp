import bcrypt from 'bcryptjs';
import { RequestInternal } from 'next-auth';
import prisma from '@client/providers/PrismaClient';

export const credentials = {
  email: { label: 'email', type: 'text' },
  password: { label: 'password', type: 'password' },
};

export async function authCredentialsAuthorize(
  credentials: Record<'email' | 'password', string> | undefined,
  req: Pick<RequestInternal, 'body' | 'query' | 'headers' | 'method'>
) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error('Invalid credentials');
  }

  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });

  if (!user || !user.hashedPassword) {
    throw new Error('Invalid credentials');
  }

  // Comparar la contraseña con la base de datos
  const isValidPassword = await bcrypt.compare(credentials.password, user.hashedPassword);

  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  return user;
}
