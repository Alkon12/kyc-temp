import 'next-auth'
import { User as UserModel, Account as AccountModel } from '@prisma/client'

declare module 'next-auth' {
  interface User
    extends Pick<
      UserModel,
      | 'id'
      | 'email'
      | 'firstName'
      | 'lastName'
      | 'phoneNumber'
      | 'picture'
    > {
      groups?: Array<{
        id: string;
        title: string;
        assignedAt: string;
      }>;
      roles?: Array<{
        id: string;
        roleName: string;
        companyId: string | null;
      }>;
    }

  interface Account extends AccountModel {}

  interface Session {
    user: User
    expires: string
  }
}
