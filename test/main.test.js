const axios = require('axios')

const externalMock = require('../index')

afterEach(() => externalMock.clean())

it('Mock a POST route and verify that it\'s called with the correct payload', async () => {
  const slackHook = jest.fn()

  const fakeSlackServer = externalMock.listen(5555)

  fakeSlackServer.post('/message').spy(slackHook).reply(200, { sent: true })

  await axios.post('http://localhost:5555/message', { text: 'Hello World' })

  expect(slackHook).toBeCalledWith({ text: 'Hello World' })
})
