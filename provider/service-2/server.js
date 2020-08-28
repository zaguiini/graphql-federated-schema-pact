const express = require("express");
const { buildFederatedSchema } = require("@apollo/federation");
const { ApolloServer, gql } = require("apollo-server-express");

const PORT = 4002;

const app = express();

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const helloResponse = new Map();
const setDefault = () => helloResponse.set("content", "Hello world!");
setDefault();

const resolvers = {
  Query: {
    hello: () => helloResponse.get("content"),
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
  playground: true,
  context: ({ req }) => {
    // Here we customize data according to the provider state
    if (
      req.headers["x-pact-provider-state"] ===
      "talent is not logged in and requests data"
    ) {
      helloResponse.set("content", null);
    } else {
      setDefault();
    }
  },
  introspection: true,
});

server.applyMiddleware({ app });

app.listen({ port: PORT }, () =>
  console.log(
    `🚀 Service 2 ready at http://localhost:${PORT}${server.graphqlPath}`
  )
);
