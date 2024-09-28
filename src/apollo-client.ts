import { onError } from "@apollo/client/link/error";
import uniqBy from "lodash/uniqBy";
import {
  split,
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { createUploadLink } from "apollo-upload-client";

const httpLink = createUploadLink({
  uri: process.env.REACT_APP_GQL_ENDPOINT,
});

const wsUrl = () => {
  if (window.location.hostname.includes("localhost")) {
    return process.env.REACT_APP_WS_ENDPOINT;
  } else {
    return `wss://${window.location.hostname}`;
  }
};

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_WS_ENDPOINT ? `${wsUrl()}` : "",
  options: {
    reconnect: true,
    connectionParams: () => {
      const token = localStorage.getItem("t") || "";
      return { token };
    },
  },
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("t");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }: any) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }: any) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) {
    if (networkError.statusCode && networkError.statusCode === 401) {
      window.location.href = "/login";
    }
    console.log(`[Network error]: ${JSON.stringify(networkError)}`);
  }
});

const splitLink = split(
  ({ query }: any) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  errorLink.concat(authLink).concat(httpLink)
);

export let client: ApolloClient<NormalizedCacheObject>;

const inMemCacheOpts = {
  typePolicies: {
    Fixture: {
      fields: {
        isSelected: {
          read(value = false) {
            return value;
          },
        },
      },
    },
    Order: {
      fields: {
        order_items: {
          merge(existing: any = [], incoming: any) {
            const newArr = existing.concat(incoming);
            return uniqBy(newArr, "__ref");
          },
        },
      },
    },
  },
};

export const createApolloClient = (): ApolloClient<NormalizedCacheObject> => {
  client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(inMemCacheOpts),
  });
  return client;
};

export const getApolloClient = (): ApolloClient<NormalizedCacheObject> =>
  client;
