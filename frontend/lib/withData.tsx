import withApollo from "next-with-apollo";
import ApolloClient from "apollo-boost";
import {
  endpoint,
  prodEndpointNow,
  prodEndpointHeroku,
  prodEndpoint
} from "../config";

function createClient({ headers }: { headers?: any }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === "development" ? endpoint : prodEndpoint,
    // process.env.DOMAIN === "heroku"
    // ? prodEndpointHeroku
    // : prodEndpointNow,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: "include"
        },
        headers: {
          cookie: headers && headers.cookie
        }
      });
    },
    onError: ({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }
  });
}

export default withApollo(createClient, { getDataFromTree: "ssr" });
