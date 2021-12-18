/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Stack, Button } from 'react-bootstrap';

import WandIcon from '../../Icons/Wand';
import LightBulletIcon from '../../Icons/LightBullet';

import {
	BiomeModifierInfoProvider,
	IRule
} from '../../../services/SeedInfo/infoHandler';
import classNames from 'classnames';
import Clickable from '../../Icons/Clickable';

import biomeNames from '../../../services/SeedInfo/data/obj/biome_names.json';
import { capitalize } from '../../../services/helpers';
import { Square } from '../../helpers';
import BiomeSelect from '../../BiomeSelect';
import BiomeModifier from '../../SeedInfo/SeedInfoViews/BiomeMod';

interface IBiomesProps {
	onUpdateConfig: (config: IRule) => void;
}

const Biomes = (props: IBiomesProps) => {
	const { onUpdateConfig } = props;
	const [firstRender, setFirstRender] = useState(true);
	const [biomeModifiers, setBiomeModifiers] = useState<{
		[biomeName: string]: string[];
	}>({});
	const [selectOpen, setSelectOpen] = useState(false);

	useEffect(() => {
		if (firstRender) {
			setFirstRender(false);
		}
		if (firstRender) {
			return;
		}
		onUpdateConfig({
			type: 'biomeModifier',
			path: '',
			params: [],
			val: biomeModifiers
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [biomeModifiers]);

	const addBiome = (biome: string, modifier: string) => {
		if (!biomeModifiers[biome]) {
			biomeModifiers[biome] = [];
		}
		biomeModifiers[biome].push(modifier);
		setBiomeModifiers({ ...biomeModifiers });
		setSelectOpen(false);
	};

	const deleteBiome = (biome: string, modifier: string) => {
		biomeModifiers[biome] = biomeModifiers[biome].filter(m => m !== modifier);
		// Special case where biome arr is empty - delete the whole key
		if (!biomeModifiers[biome].length) {
			delete biomeModifiers[biome];
		}
		setBiomeModifiers({ ...biomeModifiers });
	};

	return (
		<Container fluid>
			<p>To delete a modifier, click on it.</p>
			<Stack gap={3}>
				{Object.keys(biomeModifiers).map(biome => {
					const name = capitalize(biomeNames[biome].translated_name!);
					return (
						<div key={biome}>
							<Stack direction="horizontal">
								<div className="col-2">{name}</div>
								{biomeModifiers[biome].map(modifier => {
									return (
										<BiomeModifier
											key={modifier}
											onClick={() => deleteBiome(biome, modifier)}
											biome={''}
											modifier={modifier}
										/>
									);
								})}
							</Stack>
						</div>
					);
				})}
				<Row className="justify-content-center align-items-center">
					<Col xs="auto">
						<Button onClick={() => setSelectOpen(true)}>
							<Square>Add</Square>
						</Button>
					</Col>
				</Row>
			</Stack>
			<BiomeSelect
				filterBiomes={biomeModifiers}
				show={selectOpen}
				handleOnSelect={(biome, modifier) => addBiome(biome, modifier)}
				handleClose={() => setSelectOpen(false)}
			/>
		</Container>
	);
};

export default Biomes;
