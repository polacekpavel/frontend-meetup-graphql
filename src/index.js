import React from "react";
import ReactDOM from "react-dom";
import App from "./client/App";
import ApolloClient, { createBatchingNetworkInterface } from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { Client } from "subscriptions-transport-ws";
import { print } from "graphql-tag/printer";

const addGraphqlSubscription = (networkInterface, wsClient) => Object.assign(networkInterface, {
  subscribe: (request, handler) => wsClient.subscribe({
    query: print(request.query),
    variables: request.variables
  }, handler),
  unsubscribe: (id) => wsClient.unsubscribe(id)
});
const networkInterface = createBatchingNetworkInterface({
  uri: 'http://localhost:8080/graphql',
  batchInterval: 500
});

const wsClient = new Client('ws://localhost:8081');
const client = new ApolloClient({
  networkInterface: addGraphqlSubscription(networkInterface, wsClient)
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>,
  document.getElementById('root')
);