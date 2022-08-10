# External Mock

## Description

This module is intended to be used to mock external REST APIs that we don't
have control over in an integration test scenario.
If you need to mock requests from the same process use the Jest mock functions or Nock.

Wiremock is a commonly used alternative if you want to run another process.

## Install

`npm install external-mock`

## Example usage

```javascript
const { createMock, cleanExternalMocks } = require('external-mock')

afterEach(() => cleanExternalMocks())

it('Slack hook is used', async () => {
  const slackHook = jest.fn()

  const fakeSlackServer = createMock(5555)

  fakeSlackServer
    .post('/message')
    .spy(slackHook)
    .reply(200, { text: 'Hello World' })

  await makeOurServiceCallSlack()

  expect(slackHook).toBeCalledWith({ text: 'Temp' })
})

```

## API

### `createMock(port: number)`

**Returns: `ExternalMock`**

### `cleanExternalMocks()`

**Returns: `void`**
