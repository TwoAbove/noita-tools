/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { Modal, Row, Col, FormControl } from 'react-bootstrap';
import Fuse from 'fuse.js';

import spells from '../services/SeedInfo/data/spells.json';
import spellObj from '../services/SeedInfo/data/obj/spells.json';
import wands from '../services/SeedInfo/data/wands.json';
import Icon from './Icons/Icon';
import Clickable from './Icons/Clickable';
import {
	IShopType,
	ShopInfoProvider
} from '../services/SeedInfo/infoHandler/InfoProviders/Shop';

import { useTranslation } from 'react-i18next';

const shopInfoProvider = new ShopInfoProvider({} as any, {} as any);

const options = {
	minMatchCharLength: 2,
	// shouldSort: false,
	keys: ['id', 'name', 'description']
};

interface ISpellSelectProps {
	show: boolean;
	level?: number;
	selected: string[];
	showSelected?: boolean;
	handleClose: () => void;
	handleOnClick: (id: string) => void;
	handleSelectedClicked: (id: string) => void;
}

const SpellSelect = (props: ISpellSelectProps) => {
	const {
		level,
		show,
		showSelected,
		handleClose,
		handleOnClick,
		handleSelectedClicked,
		selected = []
	} = props;
	const [filter, setFilter] = useState('');
	const [fuse, setFuse] = useState(() => new Fuse(spells, options as any));
	const { t, i18n } = useTranslation('materials');

	useEffect(() => {
		setFuse(
			new Fuse(
				spells.map(s => ({
					...s,
					name: t(s.name),
					description: t(s.description)
				})),
				options as any
			)
		);
	}, [t, i18n, i18n.language]);

	const spellsToShow = (filter
		? fuse.search(filter).map(s => s.item)
		: spells
	)
		.filter(s =>
			level && level >= 0
				? Object.keys(s.spawn_probabilities).includes(
						String(shopInfoProvider.getShopLevel(level))
				  )
				: true
		)
		.filter(s => !selected.includes(s.id));

	const handleFilter = e => {
		setFilter(e.target.value);
	};

	return (
		<Modal fullscreen="sm-down" scrollable show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Shop Item Select</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{showSelected && selected.length > 0 && (
					<Row
						sm={8}
						className="p-3 justify-content-start align-items-center row-cols-auto"
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
				)}
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
					className="p-3 justify-content-center align-items-center row-cols-auto"
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
			</Modal.Body>
		</Modal>
	);
};

export default SpellSelect;
