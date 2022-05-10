import React, { useContext } from 'react';
import { ListGroup } from 'react-bootstrap';
import { capitalize } from '../services/helpers';
import { MaterialInfoProvider } from '../services/SeedInfo/infoHandler/InfoProviders/Material';

import i18n from '../i18n';
import { AlchemyConfigContext } from './AlchemyConfigContext';

const material = new MaterialInfoProvider(i18n);

interface IOptionProps {
	name: string;
	selected: boolean;

	handleClick: () => void;
}

const toName = (id: string, showId: boolean) =>
	capitalize(material.translate(id)) + `${showId ? ` (${id})` : ''}`;

const getTranslatedName = (s: string, showId: boolean) => {
	if (s.includes(',')) {
		return s
			.split(',')
			.map(m => toName(m, showId))
			.join(', ');
	}
	return toName(s, showId);
};

const Option = (props: IOptionProps) => {
	const { name, selected, handleClick } = props;
	return (
		<ListGroup.Item
			// {...(selected ? { color: 'success' } : {})}
			variant={selected ? 'success' : 'default'}
			onClick={handleClick}
		>
			{name}
		</ListGroup.Item>
	);
};

interface IListSelectProps {
	selected: Set<string>;
	items: string[];
	onUpdate?: (selected: Set<string>) => void;
	onClick?: (material: string) => void;
}

const ListSelect = (props: IListSelectProps) => {
	const { onClick, selected, items } = props;
	const [showId] = useContext(AlchemyConfigContext);
	const handleClick = (item: string) => {
		const newSelected = new Set(selected);
		if (newSelected.has(item)) {
			newSelected.delete(item);
		} else {
			newSelected.add(item);
		}
		if (onClick) {
			onClick(item);
		}
		if (props.onUpdate) {
			props.onUpdate(newSelected);
		}
	};

	return (
		<ListGroup>
			{items.map(item => (
				<Option
					key={item}
					name={getTranslatedName(item, showId)}
					selected={selected.has(item)}
					handleClick={() => handleClick(item)}
				/>
			))}
		</ListGroup>
	);
};

export default ListSelect;
