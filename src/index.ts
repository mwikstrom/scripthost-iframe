/**
 * Scripthost sandbox that should be loaded into an iframe
 * @packageDocumentation
 */

import { ErrorResponse, isGenericMessage } from "scripthost";
import { InlineScriptSandbox } from "scripthost-inline";

/**
 * Setup the current environment as an inline scripthost sandbox
 * @public
 */
export function setupIFrame(global = window): void {
    const inline = new InlineScriptSandbox();
    let bound: MessageEventSource | null = null;
    global.addEventListener("message", e => {
        const { data, source } = e;
        
        if (bound === null) {
            bound = source;
        }

        if (source === bound) {
            inline.post(e.data);
            inline.listen(message => source?.postMessage(message));
        } else if (source && isGenericMessage(data)) {
            const response: ErrorResponse = {
                type: "error",
                messageId: `iframe-bounce-${data.messageId}`,
                inResponseTo: data.messageId,
                message: "Sandbox is already bound to another message source"
            };
            source.postMessage(response);
        }
    });
}
