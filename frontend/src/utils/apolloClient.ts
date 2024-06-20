import { WebSocketLink } from "@apollo/client/link/ws";
import { split, HttpLink, ApolloClient, InMemoryCache } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";

const wsLink = new WebSocketLink({
  uri: `${import.meta.env.VITE_WOLVERINE_ENDPOINT}/graphql`.replace(
    "http",
    "ws",
  ),
  options: {
    reconnect: true,
    connectionCallback: (error) => {
      if (error) {
        console.log("WebSocket connection error:", error);
      } else {
        console.log("WebSocket connected successfully");
      }
    },
  },
});

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_WOLVERINE_ENDPOINT}/graphql`,
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink,
);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
