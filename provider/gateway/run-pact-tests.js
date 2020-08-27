const { Verifier } = require("@pact-foundation/pact");
const path = require("path");
const glob = require("glob");

const commonOptions = {
  provider: "Gateway",
  providerBaseUrl: `http://localhost:${process.env.GATEWAY_PORT}`,
  requestFilter: (req, _, next) => {
    req.headers["X-Pact-Test"] = "true";

    next();
  },
  providerVersion: "1",
};

const noop = () => {};

const runPactTests = ({ remote }) => {
  if (remote) {
    new Verifier({
      ...commonOptions,
      pactBrokerUrl: "http://localhost:3000",
      pactBrokerUsername: "user",
      pactBrokerPassword: "password",
      publishVerificationResult: true,
    })
      .verifyProvider()
      .then(noop)
      .catch(noop);
  } else {
    glob("../../consumer/pacts/*.json", (err, pactUrls) => {
      if (err) {
        return console.error(err);
      }

      new Verifier({
        ...commonOptions,
        pactUrls: pactUrls.map((relativePath) => path.resolve(relativePath)),
        publishVerificationResult: false,
      })
        .verifyProvider()
        .catch((err) => console.error(err));
    });
  }
};

module.exports.runPactTests = runPactTests;
