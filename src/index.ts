import ExternalMock from "./ExternalMock";

const externalMocks: ExternalMock[] = [];

export const createMock = (port: number) => {
  const externalMock = new ExternalMock(port);

  externalMocks.push(externalMock);

  return externalMock;
};

export const cleanExternalMocks = () => {
  externalMocks.forEach((server) => server.close());
};
