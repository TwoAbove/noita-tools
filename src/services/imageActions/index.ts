import { IImageActions } from './IImageActions';

// In a browser setting, just directly import
// webImageActions, bypassing this
export const loadImageActions = (): Promise<IImageActions | any> => {
  if (typeof window === 'undefined') {
    return import('./nodeImageActions');
  } else {
    return import('./webImageActions');
  }
}

export default loadImageActions();
