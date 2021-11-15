import React from 'react';
import {
	Jumbotron,
	Container,
	Row,
	Col,
	ListGroupItem,
	ListGroup
} from 'reactstrap';

interface IOptionProps {
	name: string;
	selected: boolean;

	handleClick: () => void;
}
const Option = (props: IOptionProps) => {
	const { name, selected, handleClick } = props;
	return (
		<ListGroupItem
			{...(selected ? { color: 'success' } : {})}
			onClick={handleClick}
		>
			{name}
		</ListGroupItem>
	);
};

interface IListSelectProps {
	selected: Set<string>;
	items: string[];
	onUpdate: (selected: Set<string>) => void;
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
					name={item}
					selected={selected.has(item)}
					handleClick={() => handleClick(item)}
				/>
			))}
		</ListGroup>
	);
};

export default ListSelect;
