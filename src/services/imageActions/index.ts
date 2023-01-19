import { IImageActions } from './IImageActions';

// In a browser setting, just directly import
// webImageActions, bypassing this
export const loadImageActions = (): Promise<IImageActions | any> => {
  // if is node
  if (typeof process === 'object' && typeof require === 'function') {
    return import('./nodeImageActions');
  } else {
    return import('./webImageActions');
  }
}

export default loadImageActions();
