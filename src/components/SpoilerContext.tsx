import { createContext } from 'react';
import useLocalStorage from '../services/useLocalStorage';

const SpoilerContext = createContext<any[]>([]);

const SpoilerProvider = props => {
	const [spoil, setSpoil] = useLocalStorage(
		'use-spoiler',
		false,
		d => {
			return d === 'true';
		},
		s => {
			return s.toString();
		}
	);

	return (
		<SpoilerContext.Provider value={[spoil, setSpoil]}>
			{props.children}
		</SpoilerContext.Provider>
	);
};

export { SpoilerContext, SpoilerProvider };
