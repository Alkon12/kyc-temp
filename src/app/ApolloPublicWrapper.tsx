'use client'

import { ApolloLink, HttpLink } from '@apollo/client'
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr'

function makePublicClient() {
  console.log('Apollo PUBLIC Wrapper URL', process.env.NEXT_PUBLIC_GRAPHQL_PUBLIC_URL as string)

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_PUBLIC_URL as string,
    fetchOptions: { cache: 'no-store' },
  })

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : httpLink,
  })
}

export function ApolloPublicWrapper({ children }: React.PropsWithChildren) {
  return <ApolloNextAppProvider makeClient={makePublicClient}>{children}</ApolloNextAppProvider>
}
