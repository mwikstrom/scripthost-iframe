/**
 * Scripthost bridge backend that should be loaded into an iframe
 * @packageDocumentation
 */

import { InlineScriptHostBridge } from "scripthost-inline";

/**
 * Setup the current environment as an inline scripthost bridge backend
 * @public
 */
export function setupIFrame(global = window): void {
    const inline = new InlineScriptHostBridge();
    inline.listen(message => global.parent.postMessage(message, "*"));
    global.addEventListener("message", e => inline.post(e.data));
}
