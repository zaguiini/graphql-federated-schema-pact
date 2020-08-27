const { Pact, Matchers } = require("@pact-foundation/pact");
const { InMemoryCache } = require("@apollo/client/cache");
const path = require("path");
const gql = require("graphql-tag");
const fetch = require("node-fetch");
const { print } = require("graphql/language/printer");
const { HttpLink, ApolloClient } = require("@apollo/client/core");

const { term } = Matchers;

const createGatewayGraphQLProvider = ({ port }) => {
  return new Pact({
    port,
    cors: true,
    consumer: "Talent Portal",
    provider: "Gateway",
    dir: path.resolve(process.cwd(), "pacts"),
    log: path.resolve(process.cwd(), "log/gateway_pact.log"),
    logLevel: "error",
    pactfileWriteMode: "update",
  });
};

const setupGatewayPactIntegration = () => {
  const provider = createGatewayGraphQLProvider({ port: 5202 });

  const httpLink = new HttpLink({
    fetch,
    uri: "http://localhost:5202/gateway",
  });

  jest.setTimeout(15000);

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });

  beforeAll(() => provider.setup());
  afterAll(() => provider.finalize());
  // verify with Pact and reset expectations
  afterEach(async () => {
    await provider.verify();
    await client.cache.reset();
  });

  return { provider, client };
};

const graphQLHeaders = {
  path: "/gateway",
  method: "POST",
  headers: {
    "content-type": "application/json",
  },
};

const serializeQuery = (query) => {
  const cache = new InMemoryCache();

  return print(cache.transformDocument(gql(query)));
};

const ID = (id) => {
  return term({
    generate: id || "VjEtTWVSb2xlLTEyMjc4ODQ",
    matcher: "[A-Za-z0-9]{4,24}",
  });
};

module.exports = {
  graphQLHeaders,
  serializeQuery,
  setupGatewayPactIntegration,
  ID,
};
