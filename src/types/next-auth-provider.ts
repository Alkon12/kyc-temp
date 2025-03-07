import { OAuthConfig } from 'next-auth/providers/oauth'
export type OAuthProviderOptions = Pick<OAuthConfig<any>, 'clientId' | 'clientSecret'>
