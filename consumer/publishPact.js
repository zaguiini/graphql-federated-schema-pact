#!/usr/bin/env node

const publisher = require("@pact-foundation/pact-node");
const path = require("path");

if (!process.argv[2]) {
  throw new Error(
    "Please give me the consumer version. `yarn publish-pact VERSIOn`"
  );
}

publisher.publishPacts({
  pactFilesOrDirs: [
    path.resolve(process.cwd(), "pacts/talent_portal-gateway.json"),
  ],
  pactBroker: "http://localhost:3000",
  pactBrokerUsername: "user",
  pactBrokerPassword: "password",
  consumerVersion: process.argv[2],
});
