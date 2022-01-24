/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, useEffect, useState } from 'react';

export default function useLocalStorage<T>(
	key: string,
	initialValue: T,
	deserialize: (s: string | null) => T,
	serialize: (t: T) => string
): [T, Dispatch<T>] {
	const [value, setValue] = useState<T>(() => {
		const itemInStorage = window.localStorage.getItem(key);
		if (itemInStorage === null) {
			return initialValue;
		}
		const item = deserialize(itemInStorage);
		return item;
	});

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

	const handleStorage = (event: StorageEvent) => {
		if (event.key === key && deserialize(event.newValue) !== value) {
			let item = deserialize(window.localStorage.getItem(key));
			if (typeof item === 'undefined' || item === null) {
				item = initialValue;
			}
			setValue(item);
		}
	};

	useEffect(() => {
		window.addEventListener('storage', handleStorage);
		return () => window.removeEventListener('storage', handleStorage);
	}, [handleStorage]);

	return [value, setItem];
}
