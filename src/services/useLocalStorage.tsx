/* eslint-disable react-hooks/exhaustive-deps */
import { useLiveQuery } from "dexie-react-hooks";
import { Dispatch } from "react";

import { db } from "./db";

export default function useLocalStorage<T>(key: string, initialValue: T, cb?: () => Promise<void>): [T, Dispatch<T>] {
  const query = useLiveQuery(() => db.configItems.get({ key }));
  const value = query ? query.val : initialValue;
  const setItem = (newValue: T) => {
    db.setConfig(key, newValue).finally(cb ? cb : () => {});
  };

  return [value, setItem];
}
