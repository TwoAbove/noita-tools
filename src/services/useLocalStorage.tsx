/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, useCallback, useEffect, useState } from 'react';

export default function useLocalStorage<T>(
	key: string,
	initialValue: T,
	deserialize: (s: string | null) => T,
	serialize: (t: T) => string
): [T, Dispatch<T>] {
	const [value, setValue] = useState<T>(
		() => deserialize(window.localStorage.getItem(key)) || initialValue
	);

	const setItem = (newValue: T) => {
		setValue(newValue);
		window.localStorage.setItem(key, serialize(newValue));
	};

	useEffect(() => {
		const newValue = deserialize(window.localStorage.getItem(key));
		if (value !== newValue) {
			setValue(newValue || initialValue);
		}
	});

	const handleStorage = useCallback(
		(event: StorageEvent) => {
			if (event.key === key && deserialize(event.newValue) !== value) {
				setValue(deserialize(event.newValue) || initialValue);
			}
		},
		[value]
	);

	useEffect(() => {
		window.addEventListener('storage', handleStorage);
		return () => window.removeEventListener('storage', handleStorage);
	}, [handleStorage]);

	return [value, setItem];
}
