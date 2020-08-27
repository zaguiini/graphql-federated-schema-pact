const { GraphQLInteraction, Matchers } = require("@pact-foundation/pact");
const gql = require("graphql-tag");
const {
  graphQLHeaders,
  serializeQuery,
  setupGatewayPactIntegration,
  ID,
} = require("../../config/pactHelpers");

const GetViewerData = require("../getViewerData.gql");

const { boolean, somethingLike, integer } = Matchers;

describe("Pact contract with Gateway GraphQL API", () => {
  const { provider, client } = setupGatewayPactIntegration();

  describe("get logged user data", () => {
    beforeEach(() => {
      const graphqlQuery = new GraphQLInteraction()
        .given("talent is logged in and requests his data")
        .uponReceiving("GetViewerData")
        .withOperation("GetViewerData")
        .withQuery(serializeQuery(GetViewerData))
        .withVariables({})
        .withRequest(graphQLHeaders)
        .willRespondWith({
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: {
            data: {
              viewer: {
                id: somethingLike("meu-id"),
                name: somethingLike("Zaguini"),
                __typename: "Viewer",
              },
            },
          },
        });

      return provider.addInteraction(graphqlQuery);
    });

    it("returns the correct response", async () => {
      const result = await client.query({
        query: gql(GetViewerData),
      });

      expect(result.data).toMatchObject({
        viewer: {
          __typename: "Viewer",
        },
      });
    });
  });
});
