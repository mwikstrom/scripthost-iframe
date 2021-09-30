/**
 * Scripthost sandbox that should be loaded into an iframe
 * @packageDocumentation
 */

import { InlineScriptSandbox } from "scripthost-inline";

/**
 * Setup the current environment as an inline scripthost sandbox
 * @public
 */
export function setupIFrame(global = window): void {
    const inline = new InlineScriptSandbox();
    inline.listen(message => global.parent.postMessage(message, "*"));
    global.addEventListener("message", e => inline.post(e.data));
}
