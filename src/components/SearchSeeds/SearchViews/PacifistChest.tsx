/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, FC } from 'react';
import { Row, Col, Container, Stack, Button } from 'react-bootstrap';

import classNames from 'classnames';
import Clickable from '../../Icons/Clickable';
import PerkSelect from '../../PerkSelect';
import Icon from '../../Icons/Icon';
import { Square } from '../../helpers';
import { IRule } from '../../../services/SeedInfo/infoHandler/IRule';
import Entity from '../../Icons/Entity';
import EntitySelect from '../../EntitySelect';

const availableItems = [
	// 'data/entities/misc/custom_cards/bomb.xml',
	// 'data/entities/items/pickup/goldnugget.xml',
	// 'data/entities/items/pickup/goldnugget_50.xml',
	// 'data/entities/items/pickup/goldnugget_200.xml',
	// 'data/entities/items/pickup/goldnugget_1000.xml',
	'Spell',
	'data/entities/items/pickup/potion.xml',
	'data/entities/items/pickup/potion_secret.xml',
	'data/entities/items/pickup/potion_random_material.xml',
	'data/entities/items/pickup/powder_stash.xml',
	'data/entities/items/pickup/spell_refresh.xml',
	'data/entities/items/pickup/heart.xml',
	'data/entities/items/pickup/heart_better.xml',
	'data/entities/items/pickup/heart_fullhp.xml',
	'data/entities/animals/illusions/dark_alchemist.xml',
	'data/entities/items/pickup/safe_haven.xml',
	'data/entities/items/pickup/moon.xml',
	'data/entities/items/pickup/thunderstone.xml',
	'data/entities/items/pickup/evil_eye.xml',
	'data/entities/items/pickup/brimstone.xml',
	'data/entities/items/pickup/physics_greed_die.xml',
	'data/entities/items/pickup/physics_die.xml',
	'data/entities/items/pickup/runestones/runestone_laser.xml',
	'data/entities/items/pickup/runestones/runestone_fireball.xml',
	'data/entities/items/pickup/runestones/runestone_lava.xml',
	'data/entities/items/pickup/runestones/runestone_slow.xml',
	'data/entities/items/pickup/runestones/runestone_null.xml',
	'data/entities/items/pickup/runestones/runestone_disc.xml',
	'data/entities/items/pickup/runestones/runestone_metal.xml',
	'data/entities/items/pickup/physics_gold_orb_greed.xml',
	'data/entities/items/pickup/physics_gold_orb.xml',
	'data/entities/items/wand_level_01.xml',
	'data/entities/items/wand_unshuffle_01.xml',
	'data/entities/items/wand_level_02.xml',
	'data/entities/items/wand_unshuffle_02.xml',
	'data/entities/items/wand_level_03.xml',
	'data/entities/items/wand_unshuffle_03.xml',
	'data/entities/items/wand_level_04.xml',
	'data/entities/items/wand_unshuffle_04.xml'
];

const subtextMap = {
	'data/entities/items/wand_level_01.xml': () => <div>Level 1 wand</div>,
	'data/entities/items/wand_unshuffle_01.xml': () => (
		<div>
			Level 1 wand <br /> Unshuffle
		</div>
	),
	'data/entities/items/wand_level_02.xml': () => <div>Level 2 wand</div>,
	'data/entities/items/wand_unshuffle_02.xml': () => (
		<div>
			Level 2 wand <br /> Unshuffle
		</div>
	),
	'data/entities/items/wand_level_03.xml': () => <div>Level 3 wand</div>,
	'data/entities/items/wand_unshuffle_03.xml': () => (
		<div>
			Level 3 wand <br /> Unshuffle
		</div>
	),
	'data/entities/items/wand_level_04.xml': () => <div>Level 4 wand</div>,
	'data/entities/items/wand_unshuffle_04.xml': () => (
		<div>
			Level 4 wand <br /> Unshuffle
		</div>
	)
};

interface IPacifistChestProps {
	onUpdateConfig: (config: Partial<IRule>) => void;
	config: IRule;
}

// TODO: Handle contents for potions, wands, etc
const PacifistChest: FC<IPacifistChestProps> = ({ onUpdateConfig, config }) => {
	const { val: entities } = config;
	const [selectOpen, setSelectOpen] = useState(-1);

	const setPacifistChest = newConfig => {
		onUpdateConfig({
			type: 'pacifistChest',
			path: '',
			params: [],
			strict: true,
			val: newConfig
		});
	};

	const handleAdd = id => {
		const newEntities = entities.map(p => p.slice());
		newEntities[selectOpen].push(id);
		setPacifistChest(newEntities);
	};

	const handleDelete = (id, row) => {
		const newEntities = entities.map(p => p.slice());
		const index = newEntities[row].indexOf(id);
		if (index > -1) {
			newEntities[row].splice(index, 1);
		}
		setPacifistChest(newEntities);
	};

	const toggleSelect = (n = -1) => {
		setSelectOpen(n);
	};

	return (
		<Container fluid>
			<p>
				Select what items the pacifist chest must contain. Gold will be
				<br />
				To delete an item, click on it. <br />
			</p>
			<Row className="justify-content-center">
				<Col xs={7}>
					<Stack gap={3}>
						{entities.map((row, i) => {
							return (
								<Row
									className="justify-content-center align-items-center"
									key={i}
								>
									<Col xs={3}>Level {i + 1}</Col>
									<Col>
										<Stack gap={3} direction="horizontal">
											{row.map((id, j) => {
												const Subtext = subtextMap[id];
												return (
													<div
														key={`${id}-${j}`}
														className="d-flex flex-column justify-content-center align-items-center text-center"
														onClick={() => handleDelete(id, i)}
													>
														<Entity id={id} />
														{Subtext && <Subtext />}
													</div>
												);
											})}
										</Stack>
									</Col>
									<Col className="me-auto">
										<Button onClick={() => toggleSelect(i)}>
											<Square>Add Entity</Square>
										</Button>
									</Col>
								</Row>
							);
						})}
					</Stack>
				</Col>
			</Row>
			<EntitySelect
				show={selectOpen > -1}
				selected={entities[selectOpen]}
				entitiesToShow={availableItems}
				handleClose={() => toggleSelect()}
				handleOnClick={id => handleAdd(id)}
			/>
		</Container>
	);
};

export default PacifistChest;
