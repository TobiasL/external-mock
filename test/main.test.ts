import { afterEach, expect, test, vi } from "vitest";

import { cleanExternalMocks, createMock } from "../src/index";

afterEach(() => cleanExternalMocks());

test("Mock a POST route and verify that it's called with the correct payload", async () => {
	const slackHook = vi.fn();

	const fakeSlackServer = createMock(5555);

	fakeSlackServer.post("/message").spy(slackHook).reply(200, { sent: true });

	await fetch("http://localhost:5555/message", {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ text: "Hello World" }),
	});

	expect(slackHook).toBeCalledWith({ text: "Hello World" });
});
