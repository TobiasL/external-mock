import express from "express";
import http from "http";

type RequestVerbs = "get" | "post" | "put" | "patch" | "delete";
type Payload = any; // eslint-disable-line

class ExternalResponse {
  app: express.Application;
  method: RequestVerbs;
  route: string;
  spyFn?: (payload: Payload) => void;

  constructor(app: express.Application, method: RequestVerbs, route: string) {
    this.app = app;
    this.method = method;
    this.route = route;

    this.spyFn = undefined;
  }

  spy(fn: (payload: Payload) => void) {
    this.spyFn = fn;

    return this;
  }

  reply(code: number, body: Payload) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    (this.app[this.method] as Function)(
      this.route,
      (req: express.Request, res: express.Response) => {
        if (this.spyFn) {
          this.spyFn(req.body);
        }

        if (!body) {
          return res.sendStatus(code);
        }

        return res.status(code).send(body);
      },
    );
  }
}

class ExternalMock {
  app: express.Application;
  server: http.Server;

  constructor(port: number) {
    this.app = express();

    this.app.use(express.json());

    this.server = this.app.listen(port);
  }

  close() {
    this.server.close();
  }

  get(route: string) {
    return new ExternalResponse(this.app, "get", route);
  }

  post(route: string) {
    return new ExternalResponse(this.app, "post", route);
  }

  put(route: string) {
    return new ExternalResponse(this.app, "put", route);
  }

  patch(route: string) {
    return new ExternalResponse(this.app, "patch", route);
  }

  delete(route: string) {
    return new ExternalResponse(this.app, "delete", route);
  }
}

export default ExternalMock;
