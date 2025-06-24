import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Crear el cliente de Apollo para el endpoint público
export const publicClient = new ApolloClient({
  link: createHttpLink({
    uri: '/api/public/graphql',
  }),
  cache: new InMemoryCache(),
}); 