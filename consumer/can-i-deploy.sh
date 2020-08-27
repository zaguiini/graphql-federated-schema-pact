#!/bin/bash

docker run --rm \
  -it --network=host pactfoundation/pact-cli:latest broker can-i-deploy \
  --broker-base-url http://localhost:3000 \
  --broker-username user \
  --broker-password password \
  --pacticipant 'Talent Portal' --version 1 \
  --pacticipant 'Gateway' --version 1 \
  --retry-while-unknown 150