import { IImageActions } from './IImageActions';

const isNode = typeof process === 'object' && typeof require === 'function';

// In a browser setting, just directly import
// webImageActions, bypassing this
export const loadImageActions = async (): Promise<IImageActions | any> => {
  // if is node
  if (isNode) {
    return import('./nodeImageActions');
  } else {
    if (window.OffscreenCanvas) {
      return import('./webImageActions');
    }

    // Safari support
    return import('./webCanvasImageActions');

    const skiawasm = await (await import('canvaskit-wasm/bin/canvaskit.wasm')).default;
    const canvaskitLoad = await (await import('canvaskit-wasm')).default;
    const skia = await canvaskitLoad({
      locateFile: path => {
        if (path.endsWith('.wasm')) {
          return skiawasm;
        }
        return path;
      }
    });

    return (await (await import('./webSkiaImageActions')).default)(skia)
  }
}

export default loadImageActions();
