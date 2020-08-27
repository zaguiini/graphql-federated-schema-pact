const axios = require("axios");

axios
  .post(
    "http://localhost:3000/webhooks",
    {
      events: [
        {
          name: "contract_content_changed",
        },
      ],
      request: {
        method: "POST",
        url: "http://host.docker.internal:3999/verify-consumer",
      },
    },
    {
      headers: {
        Authorization: `Basic ${Buffer.from("user:password").toString(
          "base64"
        )}`,
      },
    }
  )
  .then(() => console.log("Registered"))
  .catch((e) => console.log(e.response.data.errors));
