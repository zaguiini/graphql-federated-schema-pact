You better open some tabs.

### On `gateway` folder

- Start `service-1` (`yarn start`) and `service-2` (`yarn start`), then `gateway` (`yarn gateway`) and `mock-gateway` (`yarn mock-gateway`). Keep all four of them running;
- The Gateway is accessible at port `4000`, and services at `4001` and `4002`. The mock gateway will be available at port `3999`.

### On `broker` folder

- Start `broker` (`yarn start`);
- Run `yarn register-webhook`.
- The Broker is accessible at `3000`.

### On `consumer` folder

- Create consumer contracts with `yarn pact` and publish them with `yarn publish-pact DESIRED_VERSION`;
- Run `can-i-deploy` with `yarn can-i-deploy DESIRED_VERSION`.
