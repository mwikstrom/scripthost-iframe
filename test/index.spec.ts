import { isPingResponse, PingRequest, PingResponse } from "scripthost-core";
import { setupIFrame } from "../src";

describe("iframe", () => {
    it("can be pinged", async () => {
        setupIFrame();

        const request: PingRequest = {
            type: "ping",
            messageId: "pingtest",
        };
        
        const pong = new Promise<PingResponse>(resolve => {
            window.addEventListener("message", e => {
                if (isPingResponse(e.data)) {
                    resolve(e.data);
                }
            });
        });

        window.postMessage(request, "*");
        const response = await pong;

        expect(response).toMatchObject({
            type: "pong",
            messageId: "sandbox-1",
            inResponseTo: "pingtest",
        });
    });
});
