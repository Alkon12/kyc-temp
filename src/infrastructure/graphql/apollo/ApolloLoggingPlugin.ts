import { BaseContext, GraphQLRequestContext } from '@apollo/server'

export const ApolloLoggingPlugin = {
  // Fires whenever a GraphQL request is received from a client.
  async requestDidStart(requestContext: GraphQLRequestContext<BaseContext>) {
    // console.log('APOLLO - Request started! Query:\n' + requestContext.request.query);

    return {
      // Fires whenever Apollo Server will parse a GraphQL
      // request to create its associated document AST.
      async parsingDidStart(_requestContext: GraphQLRequestContext<BaseContext>) {
        // console.log('APOLLO - Parsing started!');
      },

      // Fires whenever Apollo Server will validate a
      // request's document AST against your GraphQL schema.
      async validationDidStart(_requestContext: GraphQLRequestContext<BaseContext>) {
        // console.log('APOLLO - Validation started!');
      },

      async contextCreationDidFail({ error }: { error: Error }): Promise<void> {
        console.log(`APOLLO ERROR - Context creation failed: ${error}`)

        Promise.resolve()
      },

      async invalidRequestWasReceived({ error }: { error: Error }): Promise<void> {
        console.log(`APOLLO ERROR - Bad request: ${error}`)

        Promise.resolve()
      },

      async unexpectedErrorProcessingRequest({
        requestContext,
        error,
      }: {
        requestContext: GraphQLRequestContext<BaseContext>
        error: Error
      }): Promise<void> {
        console.log(`APOLLO ERROR - Something went wrong: ${error}`, requestContext)
      },
    }
  },
}
