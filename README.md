# External Mock

[![Build Status](https://github.com/TobiasL/external-mock/workflows/Test%20and%20lint/badge.svg)](https://github.com/TobiasL/external-mock/actions)
[![Available on NPM](https://img.shields.io/npm/v/external-mock.svg)](https://npmjs.com/package/external-mock)

_Mock external REST APIs that we don't have control over in an integration test scenario._

## About

External Mock is intended to be used to mock external REST APIs that we don't
have control over in an integration test scenario.

If you need to mock requests from the same process use the [Jest mock](https://jestjs.io/docs/mock-functions) functions or [Nock](https://github.com/nock/nock).

[Wiremock](https://github.com/wiremock/wiremock) is a commonly used alternative if you want to run another process.

## Install

Using npm:

```bash
$ npm install --save-dev external-mock
```

## Example usage

```javascript
const { createMock, cleanExternalMocks } = require("external-mock");

afterEach(() => cleanExternalMocks());

test("Slack hook is used", async () => {
  const slackHook = jest.fn();

  const fakeSlackServer = createMock(5555);

  fakeSlackServer
    .post("/message")
    .spy(slackHook)
    .reply(200, { text: "Hello World" });

  await makeOurServiceCallSlack();

  expect(slackHook).toBeCalledWith({ text: "Temp" });
});
```

## API

### `createMock(port: number): ExternalMock`

Starts a server without any request handlers on the specified port.
Add request handlers by calling the HTTP verbs functions on the returned `ExternalMock` instance.
The available functions are `get`, `post`, `put`, `patch` and `delete`.

A test spy can optionally be added by calling the function `spy` after the HTTP verbs.

The request handler is finalized by calling the function `reply` with the status code and optionally a response body.

### `cleanExternalMocks(): void`

Call to clean up all created mocks after the test is done.
