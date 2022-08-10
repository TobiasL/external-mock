import axios from 'axios'

import { createMock, cleanExternalMocks } from '../src/index'

afterEach(() => cleanExternalMocks())

it('Mock a POST route and verify that it\'s called with the correct payload', async () => {
  const slackHook = jest.fn()

  const fakeSlackServer = createMock(5555)

  fakeSlackServer.post('/message').spy(slackHook).reply(200, { sent: true })

  await axios.post('http://localhost:5555/message', { text: 'Hello World' })

  expect(slackHook).toBeCalledWith({ text: 'Hello World' })
})
