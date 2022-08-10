import express from 'express'

const externalMocks: ExternalMock[] = []

class ExternalResponse {
  app: any
  method: string
  route: string
  spyFn?: (payload: any) => void

  constructor(app: any, method: string, route: string) {
    this.app = app
    this.method = method
    this.route = route

    this.spyFn = undefined
  }

  spy(fn: (payload: any) => void) {
    this.spyFn = fn

    return this
  }

  reply(code: number, body: any) {
    this.app[this.method](this.route, (req: any, res: any) => {
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
  app: any
  server: any

  constructor(port: number) {
    this.app = express()

    this.app.use(express.json())

    this.server = this.app.listen(port)
  }

  close() {
    this.server.close()
  }

  get(route: string) {
    return new ExternalResponse(this.app, 'get', route)
  }

  post(route: string) {
    return new ExternalResponse(this.app, 'post', route)
  }

  put(route: string) {
    return new ExternalResponse(this.app, 'put', route)
  }

  patch(route: string) {
    return new ExternalResponse(this.app, 'patch', route)
  }

  delete(route: string) {
    return new ExternalResponse(this.app, 'delete', route)
  }
}

export const createMock = (port: number) => {
  const externalMock = new ExternalMock(port)

  externalMocks.push(externalMock)

  return externalMock
}

export const cleanExternalMocks = () => {
  externalMocks.forEach((server) => server.close())
}
