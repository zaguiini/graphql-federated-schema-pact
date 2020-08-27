const express = require("express");

const { ApolloServer } = require("apollo-server-express");
const { ApolloGateway } = require("@apollo/gateway");

const { runPactTests } = require("./run-pact-tests");

const gateway = new ApolloGateway({
  serviceList: [
    { name: "viewer", url: "http://localhost:4001/graphql" },
    { name: "hello", url: "http://localhost:4002/graphql" },
  ],
});

const server = new ApolloServer({
  gateway,
  playground: true,
  subscriptions: false,
  introspection: true,
});

const app = express();

app.post("/verify-consumer", (_, res) => {
  runPactTests({
    remote: true,
  });

  res.send(200);
});

server.applyMiddleware({ app, path: "/gateway" });

app.listen(process.env.GATEWAY_PORT, () => {
  console.log(`Listening on port ${process.env.GATEWAY_PORT}`);
});
