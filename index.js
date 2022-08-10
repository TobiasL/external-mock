const express = require('express')

const externalMocks = []

class ExternalResponse {
  constructor(app, method, route) {
    this.app = app
    this.method = method
    this.route = route

    this.spyFn = null
  }

  spy(fn) {
    this.spyFn = fn

    return this
  }

  reply(code, body) {
    this.app[this.method](this.route, (req, res) => {
      if (this.spyFn) {
        this.spyFn(req.body)
      }

      if (!body) {
        return res.sendStatus(code)
      }

      return res.status(code).send(body)
    })
  }
}

class ExternalMock {
  constructor(port) {
    this.app = express()

    this.app.use(express.json())

    this.server = this.app.listen(port)
  }

  close() {
    this.server.close()
  }

  get(route) {
    return new ExternalResponse(this.app, 'get', route)
  }

  post(route) {
    return new ExternalResponse(this.app, 'post', route)
  }

  put(route) {
    return new ExternalResponse(this.app, 'put', route)
  }

  patch(route) {
    return new ExternalResponse(this.app, 'patch', route)
  }

  delete(route) {
    return new ExternalResponse(this.app, 'delete', route)
  }
}

module.exports = {
  listen: (port) => {
    const externalMock = new ExternalMock(port)

    externalMocks.push(externalMock)

    return externalMock
  },
  clean: () => {
    externalMocks.forEach((server) => server.close())
  },
}
