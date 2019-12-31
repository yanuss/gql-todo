import withApollo from "next-with-apollo";
import ApolloClient from "apollo-boost";
import { endpoint, prodEndpoint } from "../config";

function createClient({ headers }: { headers?: any }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === "development" ? endpoint : prodEndpoint,
    request: operation => {
      const token = localStorage.getItem("token");
      operation.setContext({
        fetchOptions: {
          credentials: "include"
          // credentials: "same-origin"
        },
        headers: {
          // ...headers,
          cookie: headers && headers.cookie
          // authorization: token ? `Bearer ${token}` : ""
        }
        // credentials: "include"
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
