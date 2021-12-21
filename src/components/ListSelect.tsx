import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { capitalize } from '../services/helpers';

import { MaterialInfoProvider } from '../services/SeedInfo/infoHandler';

const material = new MaterialInfoProvider({} as any);

interface IOptionProps {
	name: string;
	selected: boolean;

	handleClick: () => void;
}

const getTranslatedName = (s: string) => {
	if (s.includes(',')) {
		return s.split(',').map(m => capitalize(material.provide(m).translated_name)).join(', ');
	}
	return capitalize(material.provide(s).translated_name)
}

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
}

const ListSelect = (props: IListSelectProps) => {
	const { selected, items } = props;

	const handleSelectedChanged = (selected: Set<string>) => {
		if (props.onUpdate) {
			props.onUpdate(selected);
		}
	};
	const handleClick = (item: string) => {
		const newSelected = new Set(selected);
		if (newSelected.has(item)) {
			newSelected.delete(item);
		} else {
			newSelected.add(item);
		}
		handleSelectedChanged(newSelected);
	};

	return (
		<ListGroup>
			{items.map(item => (
				<Option
					key={item}
					name={getTranslatedName(item)}
					selected={selected.has(item)}
					handleClick={() => handleClick(item)}
				/>
			))}
		</ListGroup>
	);
};

export default ListSelect;
