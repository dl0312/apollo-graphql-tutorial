import { ApolloClient } from "apollo-client";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";
import React from "react";
import ReactDOM from "react-dom";
import Pages from "./pages";
import injectStyles from "./styles";
import gql from "graphql-tag";
import { resolvers, typeDefs } from "./resolvers";
import Login from "./pages/login";

const cache = new InMemoryCache();
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: "http://localhost:4000/graphql",
    headers: {
      authorization: localStorage.getItem("token"),
    },
  }),

  typeDefs,
  resolvers,
});

cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem("token"),
    cartItems: [],
  },
});
client
  .query({
    query: gql`
      query GetLaunch {
        launch(id: 56) {
          id
          mission {
            name
          }
        }
      }
    `,
  })
  .then((result) => console.log(result));

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

function IsLoggedIn() {
  const { data } = useQuery(IS_LOGGED_IN);
  return data.isLoggedIn ? <Pages /> : <Login />;
}

injectStyles();
ReactDOM.render(
  <ApolloProvider client={client}>
    <IsLoggedIn />
  </ApolloProvider>,
  document.getElementById("root")
);
