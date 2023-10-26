import { IImageActions } from "./IImageActions";

const isNode = typeof process === "object" && typeof require === "function";

// In a browser setting, just directly import
// webImageActions, bypassing this
export const loadImageActions = async (): Promise<IImageActions | any> => {
  // if is node
  if (isNode) {
    const url = new URL("./nodeImageActions", import.meta.url);
    return import(url.href);
  } else {
    if (typeof OffscreenCanvas === "undefined") {
      // Old Mobile Safari support
      const url = new URL("./webCanvasImageActions", import.meta.url);
      return import(url.href);
    }

    const url = new URL("./webImageActions", import.meta.url);
    return import(url.href);
  }
};

export default loadImageActions();
