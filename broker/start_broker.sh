#!/bin/bash

docker run --env-file .env -p 127.0.0.1:3000:9292/tcp -d pactfoundation/pact-broker