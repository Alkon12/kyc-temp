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
      | 'uberDriverId'
      | 'uberRating'
      | 'uberPromoCode'
      | 'uberActivationStatus'
      | 'uberPartnerRole'
      | 'uberEarningsRetentionActive'
    > {}

  interface Account extends AccountModel {}

  interface Session {
    user: User
    expires: string
  }
}
