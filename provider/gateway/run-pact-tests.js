const { Verifier } = require("@pact-foundation/pact");
const path = require("path");
const glob = require("glob");

class CurrentProviderStateStore {
  getState() {
    return this.state;
  }

  setState(state) {
    this.state = state;
  }
}

const currentStateStore = new CurrentProviderStateStore();

const states = [
  "talent is logged in and requests his data",
  "talent is not logged in and requests data",
];

const stateHandlers = states.reduce((acc, next) => {
  acc[next] = () => {
    currentStateStore.setState(next);
    return Promise.resolve();
  };

  return acc;
}, {});

const commonOptions = {
  provider: "Gateway",
  providerBaseUrl: `http://localhost:${process.env.GATEWAY_PORT}`,
  providerVersion: "1",
  stateHandlers: stateHandlers,
  requestFilter: (req, _, next) => {
    // Here we set the Gateway provider state which propagates through the services
    req.headers["X-Pact-Provider-State"] = currentStateStore.getState();

    next();
  },
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
