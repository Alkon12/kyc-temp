import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev'
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc'

console.log('ApolloWrapper URL', process.env.NEXT_PUBLIC_GRAPHQL_URL as string)

const httpLink = createHttpLink({
  // uri: "http://localhost:3000/api/graphql",
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL as string,
})

const authLink = setContext((_, { headers }) => {
  // const token = localStorage.getItem('token');
  const token = 'aaaaaaabbbbbbbccccccddddddeeeeeeeeffff'

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  })
})

// const apolloClient = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache(),
// });

loadDevMessages()
loadErrorMessages()

export default getClient
