const express = require("express");
const { buildFederatedSchema } = require("@apollo/federation");
const { ApolloServer, gql } = require("apollo-server-express");

const PORT = 4001;

const app = express();

const typeDefs = gql`
  type Viewer @key(fields: "id") {
    id: ID!
    name: String!
  }

  type Query {
    viewer: Viewer!
  }
`;

const resolvers = {
  Query: {
    viewer: () => ({
      id: "meu-id",
      name: "Zaguini",
    }),
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
  introspection: true,
});

server.applyMiddleware({ app });

app.listen({ port: PORT }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  )
);
