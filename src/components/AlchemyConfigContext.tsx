import { createContext } from 'react';
import useLocalStorage from '../services/useLocalStorage';

const AlchemyConfigContext = createContext<any[]>([]);

const AlchemyConfigProvider = props => {
	const [spoil, setSpoil] = useLocalStorage(
		'alchemy-show-id',
		false,
		d => {
			return d === 'true';
		},
		s => {
			return s.toString();
		}
	);

	return (
		<AlchemyConfigContext.Provider value={[spoil, setSpoil]}>
			{props.children}
		</AlchemyConfigContext.Provider>
	);
};

export { AlchemyConfigContext, AlchemyConfigProvider };
