/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import {
	Modal,
	Row,
	Col,
	FormControl,
	Stack,
	ListGroup,
	Collapse
} from 'react-bootstrap';
import Fuse from 'fuse.js';

import {
	BiomeModifierInfoProvider,
	IRule
} from '../services/SeedInfo/infoHandler';
import biomeModifiers from '../services/SeedInfo/data/obj/biome_modifiers.json';
import biomeNames from '../services/SeedInfo/data/obj/biome_names.json';
import perks from '../services/SeedInfo/data/perks_new.json';
import Icon from './Icons/Icon';
import { capitalize, Objectify } from '../services/helpers';
import BiomeModifier from './SeedInfo/SeedInfoViews/BiomeMod';

const options = {
	shouldSort: false,
	keys: ['id', 'ui_name']
};

const biomeInfoProvider = new BiomeModifierInfoProvider({} as any);

const availableBiomeModifiers = Object.values(biomeModifiers as Objectify<
	typeof biomeModifiers
>).reduce(
	(c, bm) => {
		for (const biome in c) {
			if (
				bm.does_not_apply_to_biome &&
				bm.does_not_apply_to_biome.includes(biome)
			) {
				continue;
			}
			if (bm.apply_only_to_biome && !bm.apply_only_to_biome.includes(biome)) {
				continue;
			}
			c[biome].push(bm.id);
		}
		return c;
	},
	biomeInfoProvider.biomes
		.flat(2)
		.reduce<{ [modifier: string]: string[] }>((c, b) => {
			c[b] = [];
			return c;
		}, {})
);

interface IBiomeSelectProps {
	show: boolean;
	filterBiomes?: { [biome: string]: string[] };
	handleClose: () => void;
	handleOnSelect: (biome: string, modifier: string) => void;
}

const BiomeSelect = (props: IBiomeSelectProps) => {
	const { show, handleClose, handleOnSelect, filterBiomes = {} } = props;
	const [selectedBiome, setSelectedBiome] = useState('');

	const availableFilteredBiomeModifiers = Object.entries(filterBiomes).reduce(
		(c, [biome, modifiers]) => {
			if (c[biome]) {
				c[biome] = c[biome].filter(b => !modifiers.includes(b));
			}
			if (c[biome] && !c[biome].length) {
				delete c[biome];
			}
			return c;
		},
		availableBiomeModifiers
	);

	const biomesToShow = Object.keys(availableFilteredBiomeModifiers).filter(
		b => biomeNames[b].translated_name
	);

	const handleSubmit = (biome: string, modifier: string) => {
		handleOnSelect(biome, modifier);
		setSelectedBiome('');
	};

	const handlePreClose = () => {
		setSelectedBiome('');
		handleClose();
	};

	return (
		<Modal fullscreen="sm-down" scrollable show={show} onHide={handlePreClose}>
			<Modal.Header closeButton>
				<Modal.Title>Biome Selector</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Collapse in={!selectedBiome}>
					<ListGroup className="">
						{biomesToShow.map(biome => {
							return (
								<ListGroup.Item
									key={biome}
									action
									onClick={() => setSelectedBiome(biome)}
								>
									<div className="m-1">
										{capitalize(biomeNames[biome].translated_name)}
									</div>
								</ListGroup.Item>
							);
						})}
					</ListGroup>
				</Collapse>
				<Collapse in={!!selectedBiome}>
					<ListGroup className="">
						{selectedBiome &&
							availableFilteredBiomeModifiers[selectedBiome].map(modifier => {
								return (
									<ListGroup.Item
										key={modifier}
										className="d-flex"
										action
										onClick={() => handleSubmit(selectedBiome, modifier)}
									>
										<div className="mx-auto"></div>
										<BiomeModifier
											biome={''}
											modifier={biomeModifiers[modifier]}
										/>
										<div className="mx-auto"></div>
									</ListGroup.Item>
								);
							})}
					</ListGroup>
				</Collapse>
			</Modal.Body>
		</Modal>
	);
};

export default BiomeSelect;
