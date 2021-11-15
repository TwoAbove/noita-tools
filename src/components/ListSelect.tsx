import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { capitalize } from '../services/helpers';

import GameInfoProvider from '../services/SeedInfo/infoHandler';

interface IOptionProps {
	name: string;
	selected: boolean;

	handleClick: () => void;
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
	onUpdate: (selected: Set<string>) => void;
}

const waitToLoad = (gameInfoProvider): Promise<void> =>
	new Promise(async res => {
		if (!gameInfoProvider) {
			return res();
		}
		while (!gameInfoProvider.ready) {
			await new Promise(r => setTimeout(r, 50));
		}
		return res();
	});

const ListSelect = (props: IListSelectProps) => {
	const { selected, items } = props;
	const [, setData] = useState<ReturnType<GameInfoProvider['provideAll']>>();
	const updateData = () => {
		const data = gameInfoProvider.provideAll();
		setData(data);
	};
	const [gameInfoProvider] = useState(() => new GameInfoProvider({}));
	useEffect(() => {
		waitToLoad(gameInfoProvider).then(() => {
			const data = gameInfoProvider.provideAll();
			setData(data);
			gameInfoProvider.addEventListener('update', event => {
				updateData();
			});
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gameInfoProvider]);

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
	if (!gameInfoProvider.ready) {
		return <div>Loading</div>;
	}
	return (
		<ListGroup>
			{items.map(item => (
				<Option
					key={item}
					name={capitalize(
						gameInfoProvider.providers.material.provide(item).translated_name
					)}
					selected={selected.has(item)}
					handleClick={() => handleClick(item)}
				/>
			))}
		</ListGroup>
	);
};

export default ListSelect;
