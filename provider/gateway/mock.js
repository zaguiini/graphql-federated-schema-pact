const {
  buildClientSchema,
  graphqlSync,
  buildSchema,
  getIntrospectionQuery,
} = require("graphql");
const { Verifier } = require("@pact-foundation/pact");
const { readFileSync } = require("fs");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { addMocksToSchema } = require("@graphql-tools/mock");

const schemaSDL = readFileSync("./schema.graphql").toString();

const introspection = graphqlSync(
  buildSchema(schemaSDL),
  getIntrospectionQuery()
);

const mockedSchema = addMocksToSchema({
  schema: buildClientSchema(introspection.data),
});

const server = new ApolloServer({
  schema: mockedSchema,
  playground: true,
  subscriptions: false,
  introspection: true,
});

const app = express();

app.post("/verify-consumer", (_, res) => {
  const opts = {
    provider: "Gateway",
    providerBaseUrl: `http://localhost:${process.env.MOCK_GATEWAY_PORT}`,
    pactBrokerUrl: "http://localhost:3000",
    pactBrokerUsername: "user",
    pactBrokerPassword: "password",
    publishVerificationResult: true,
    providerVersion: "1",
  };

  new Verifier().verifyProvider(opts);

  res.send(200);
});

server.applyMiddleware({ app, path: "/gateway" });

app.listen(process.env.MOCK_GATEWAY_PORT, () => {
  console.log(`Listening`);
});
