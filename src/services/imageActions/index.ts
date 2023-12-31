import { IImageActions } from "./IImageActions";

const isNode = typeof process === "object" && typeof require === "function";

// In a browser setting, just directly import
// webImageActions, bypassing this
export const loadImageActions = async (): Promise<IImageActions | any> => {
  // if is node
  if (isNode) {
    // We don't use vite in node, so this is an escape hatch
    // to not attempt to bundle nodeImageActions
    const url = new URL("./nodeImageActions", import.meta.url);
    return import(url.href);
  } else {
    if (typeof OffscreenCanvas === "undefined") {
      // Old Mobile Safari support
      return import("./webCanvasImageActions");
    }

    return import("./webImageActions");
  }
};

export default loadImageActions();
