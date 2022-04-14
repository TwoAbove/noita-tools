/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { Modal, Row, Col, FormControl } from 'react-bootstrap';
import Fuse from 'fuse.js';

import spells from '../../../services/SeedInfo/data/spells.json';
import spellObj from '../../../services/SeedInfo/data/obj/spells.json';
import wands from '../../../services/SeedInfo/data/wands.json';
import Icon from '../../Icons/Icon';
import Clickable from '../../Icons/Clickable';
import {
	IShopType,
	ShopInfoProvider
} from '../../../services/SeedInfo/infoHandler/InfoProviders/Shop';

import { useTranslation } from 'react-i18next';

const shopInfoProvider = new ShopInfoProvider({} as any, {} as any);

const spellOptions = {
	minMatchCharLength: 2,
	// shouldSort: false,
	keys: ['id', 'name', 'description']
};
const spellFuse = new Fuse(spells, spellOptions);

interface ISpellSelectProps {
	level?: number;
	filter: string;
	selected: string[];
	handleFilter: (e: any) => void;
	handleOnClick: (id: string) => void;
	handleSelectedClicked: (id: string) => void;
}

const SpellSelect = (props: ISpellSelectProps) => {
	const {
		level = -1,
		filter,
		selected,
		handleFilter,
		handleOnClick,
		handleSelectedClicked
	} = props;

	const [t] = useTranslation('materials');

	const spellsToShow = (filter
		? spellFuse.search(filter).map(s => s.item)
		: spells
	)
		.filter(s =>
			level >= 0
				? Object.keys(s.spawn_probabilities).includes(
						String(shopInfoProvider.getShopLevel(level))
				  )
				: true
		)
		.filter(s => !selected.includes(s.id));

	return (
		<>
			{selected.length ? (
				<Row
					sm={8}
					className="p-2 justify-content-center align-items-center row-cols-auto"
				>
					{selected.map(s => {
						const spell = spellObj[s];
						return (
							<Col className="p-0 m-1" key={spell.id}>
								<Clickable
									useHover
									onClick={() => handleSelectedClicked(spell.id)}
								>
									<Icon
										uri={spell.sprite}
										alt={t(spell.description)}
										title={t(spell.name)}
										background
									/>
								</Clickable>
							</Col>
						);
					})}
				</Row>
			) : null}
			<Row className="p-1 ps-4 pe-4 align-items-center">
				<FormControl
					type="search"
					placeholder="Filter"
					className=""
					aria-label="Filter"
					value={filter}
					onChange={handleFilter}
				/>
			</Row>
			<Row
				sm={8}
				className="p-2 justify-content-center align-items-center row-cols-auto"
			>
				{spellsToShow.map(spell => {
					return (
						<Col className="p-0 m-1" key={spell.id}>
							<Clickable useHover onClick={() => handleOnClick(spell.id)}>
								<Icon
									uri={spell.sprite}
									alt={t(spell.description)}
									title={t(spell.name)}
									background
									/>
							</Clickable>
						</Col>
					);
				})}
			</Row>
		</>
	);
};

const wandOptions = {
	shouldSort: false,
	keys: ['id', 'name', 'description']
};

const wandFuse = new Fuse(wands, wandOptions);

interface IWandSelectProps {}
const WandSelect = (props: IWandSelectProps) => {
	return <>Wand search in development</>;
};

type IShopSelectProps = {
	type: number;
	level?: number;
	selected: any[];
	show: boolean;
	handleClose: () => void;
	handleOnClick: (id: string) => void;
	handleSelectedClicked: (id: string) => void;
};

const ShopSelect = (props: IShopSelectProps) => {
	const {
		type,
		level,
		show,
		handleClose,
		handleOnClick,
		handleSelectedClicked,
		selected = []
	} = props;
	const [filter, setFilter] = useState('');

	const handleFilter = e => {
		setFilter(e.target.value);
	};

	const Select = type === IShopType.item ? SpellSelect : WandSelect;
	return (
		<Modal fullscreen="sm-down" scrollable show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Shop Item Select</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Select
					level={level}
					filter={filter}
					selected={selected}
					handleFilter={handleFilter}
					handleOnClick={handleOnClick}
					handleSelectedClicked={handleSelectedClicked}
				/>
			</Modal.Body>
		</Modal>
	);
};

export default ShopSelect;
