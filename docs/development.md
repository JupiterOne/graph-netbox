# Development of the Netbox integration

## Provider account setup

A Netbox demo environment can be found [here](https://demo.netbox.dev/). The
demo data is reset nightly.

- Create an account [here](https://demo.netbox.dev/plugins/demo/login/).
- Create an API Token via the top right drop down and by selecting
  [API Tokens ](https://demo.netbox.dev/user/api-tokens/).
  - Uncheck `Write enabled`
  - Add `Allowed IPs` as needed for the JupiterOne platform to make requests.
- Copy the Key value and set API_KEY in the .env file
- In the .env file, set HOST to https://demo.netbox.dev


