/**
 * Scripthost sandbox that should be loaded into an iframe
 * @packageDocumentation
 */

import { ErrorResponse, isGenericMessage } from "scripthost-core";
import { InlineScriptSandbox } from "scripthost-inline";

/**
 * Setup the current environment as an inline scripthost sandbox
 * @public
 */
export function setupIFrame(global = window): void {
    const inline = new InlineScriptSandbox();
    const ignore = new Set<string>();
    let bound: MessageEventSource | null = null;
    global.addEventListener("message", e => {
        const data = e.data;
        const source = (e.source as WindowProxy) || global.parent || global;

        if (!isGenericMessage(data)) {
            return;
        }
        
        if (bound === null) {
            bound = source;
            inline.listen(message => {
                if (isGenericMessage(message)) {
                    ignore.add(message.messageId);
                    source.postMessage(message, "*");
                    ignore.delete(message.messageId);
                }
            });
        }

        if (ignore.has(data.messageId)) {
            return;
        }

        if (source === bound) {
            inline.post(data);            
        } else {
            const response: ErrorResponse = {
                type: "error",
                messageId: `iframe-bounce-${data.messageId}`,
                inResponseTo: data.messageId,
                message: "Sandbox is already bound to another message source"
            };
            source.postMessage(response, "*");
        }
    });
}
