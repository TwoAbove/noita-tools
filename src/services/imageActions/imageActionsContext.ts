import { createContext, useState } from 'react';
import { loadImageActions } from '.';
import { IImageActions } from './IImageActions';

export const useImageActions = (): IImageActions | undefined => {
  const [imageActions, setImageActions] = useState<IImageActions | undefined>(
    () => {
      loadImageActions()
        .then(setImageActions)
        .catch(e => console.error(e));
      return undefined;
    }
  );

  return imageActions;
};

// We will verify that everything's loaded before using this.
export const ImageActionsContext = createContext<IImageActions>(undefined as unknown as IImageActions);
