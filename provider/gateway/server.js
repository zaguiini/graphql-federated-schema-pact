const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

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
});

server.listen().then(({ url }) => {
  console.log(`Listening at ${url}`);
});
