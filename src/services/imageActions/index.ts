import { IImageActions } from "./IImageActions";

const isNode = typeof process === "object" && typeof require === "function";

// In a browser setting, just directly import
// webImageActions, bypassing this
export const loadImageActions = async (): Promise<IImageActions | any> => {
  // if is node
  if (isNode) {
    return import("./nodeImageActions");
  } else {
    if (typeof OffscreenCanvas === "undefined") {
      // Old Mobile Safari support
      return import("./webCanvasImageActions");
    }

    return import("./webImageActions");
  }
};

export default loadImageActions();
