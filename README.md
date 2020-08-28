You better open some tabs.

# What is happening here

We're getting the desired provider state name and injecting it as a header. Then, this header is forwarded to the micro services and the micro services populates databases and stuff. After that, the queries are executed normally.

[Here is a diagram explaining what's happening.](https://docs.google.com/drawings/d/1ZowY_lLeEIYKJHge0xrGQ0_QmGQdS7m59n1EMQha7vk)

### On `gateway` folder

- Start `service-1` (`yarn start`) and `service-2` (`yarn start`), then `gateway` (`yarn gateway`). Keep all three of them running;
- The Gateway is accessible at port `4000`, and services at `4001` and `4002`.

### On `broker` folder

- Start `broker` (`yarn start`);
- Run `yarn register-webhook`.
- The Broker is accessible at `3000`.

This step is optional.

### On `consumer` folder

- Create consumer contracts with `yarn pact`;
- Publish them with `yarn publish-pact DESIRED_VERSION` and check the result with `yarn can-i-deploy DESIRED_VERSION` (this step is optional and only works if you started the broker).

## Testing without the broker

You can run `yarn pact:test` on the `gateway` folder. Keep in mind that you still need to run both the micro services and the gateway.
