import { OAuthConfig } from 'next-auth/providers/oauth'
import axios from 'axios'
import { OAuthProviderOptions } from '@/types/next-auth-provider'
import { User } from 'next-auth'

const CALLBACK_URL = `${process.env.NEXTAUTH_URL}/api/auth/callback/uber`

const UberProvider = (options: OAuthProviderOptions): OAuthConfig<any> => ({
  ...{
    id: 'uber',
    name: 'Uber',
    type: 'oauth',
    version: '2.0',
    callbackUrl: CALLBACK_URL,
    allowDangerousEmailAccountLinking: true,
    authorization: {
      url: 'https://auth.uber.com/oauth/v2/authorize',
      params: {
        scope: process.env.UBER_CLIENT_SCOPE,
        client_id: options.clientId,
        redirect_uri: CALLBACK_URL,
        response_type: 'code',
      },
    },
    token: 'https://auth.uber.com/oauth/v2/token',
    userinfo: {
      async request(context) {
        try {
          const { access_token } = context.tokens
          const options = {
            method: 'GET',
            url: 'https://api.uber.com/v1/partners/me',
            headers: {
              Authorization: `Bearer ${access_token}`,
              'Accept-Language': 'en_US',
              'Content-Type': 'application/json',
            },
          }

          const { data: user } = await axios(options)

          // this return goes as prop in the profile (user in our case)
          return user
        } catch (error) {
          console.log('4444444 error', error)
        }
      },
    },
    // to extend, modify types/next-auth.d.ts
    profile: async (profile, tokens): Promise<User> => {
      return {
        id: profile.driver_id,
        name: `${profile.first_name} ${profile.last_name}`,
        firstName: profile.first_name,
        lastName: profile.last_name,
        email: profile.email,
        image: profile.picture,
        picture: profile.picture,
        phoneNumber: profile.phone_number,
        uberDriverId: profile.driver_id,
        uberRating: profile.rating,
        uberPromoCode: profile.promo_code,
        uberActivationStatus: profile.activation_status,
        uberPartnerRole: profile.partner_role,
        uberEarningsRetentionActive: profile.earnings_retention?.active,
        // auto_disbursements_elgibile_products:
      }
    },
  },
  ...options,
})

export default UberProvider
