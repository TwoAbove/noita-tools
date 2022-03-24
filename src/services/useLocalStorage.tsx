/* eslint-disable react-hooks/exhaustive-deps */
import { useLiveQuery } from 'dexie-react-hooks';
import { Dispatch } from 'react';

import { db } from './db';

export default function useLocalStorage<T>(
	key: string,
	initialValue: T
): [T, Dispatch<T>] {
	const query = useLiveQuery(() => db.configItems.get({ key }));
	const value = query ? query.val : initialValue;
	const setItem = (newValue: T) => {
		db.setConfig(key, newValue);
	};

	return [value, setItem];
}
