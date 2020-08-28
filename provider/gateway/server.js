const express = require("express");

const { ApolloServer } = require("apollo-server-express");
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");

const { runPactTests } = require("./run-pact-tests");

const gateway = new ApolloGateway({
  serviceList: [
    { name: "viewer", url: process.env.VIEWER_SERVICE_URL },
    { name: "hello", url: process.env.HELLO_SERVICE_URL },
  ],
  buildService({ url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        const { headers } = context;

        const pactStateKey = "x-pact-provider-state";

        if (headers && headers[pactStateKey] && request.http) {
          request.http.headers.set(pactStateKey, headers[pactStateKey]);
        }
      },
    });
  },
});

const server = new ApolloServer({
  gateway,
  playground: true,
  subscriptions: false,
  introspection: true,
  context: ({ req }) => {
    return {
      headers: req.headers,
    };
  },
});

const app = express();

app.post("/verify-consumer", (_, res) => {
  runPactTests({
    remote: true,
  });

  res.sendStatus(200);
});

server.applyMiddleware({ app, path: "/gateway" });

app.listen(process.env.GATEWAY_PORT, () => {
  console.log(
    `🚀 Gateway ready at http://localhost:${process.env.GATEWAY_PORT}${server.graphqlPath}`
  );
});
