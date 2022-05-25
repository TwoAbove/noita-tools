/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, FC } from 'react';
import { Row, Col, Container, Stack, Button } from 'react-bootstrap';

import WandIcon from '../../Icons/Wand';
import LightBulletIcon from '../../Icons/LightBullet';

import classNames from 'classnames';
import Clickable from '../../Icons/Clickable';

import { capitalize } from '../../../services/helpers';
import { Square } from '../../helpers';
import BiomeSelect from '../../BiomeSelect';
import BiomeModifier from '../../SeedInfo/SeedInfoViews/BiomeMod';
import { IRule } from '../../../services/SeedInfo/infoHandler/IRule';
import { BiomeInfoProvider } from '../../../services/SeedInfo/infoHandler/InfoProviders/Boime';

const biomeInfoProvider = new BiomeInfoProvider({} as any);

interface IBiomesProps {
	onUpdateConfig: (config: Partial<IRule>) => void;
	config: IRule;
}

const Biomes: FC<IBiomesProps> = ({ onUpdateConfig, config }) => {
	const [selectOpen, setSelectOpen] = useState(false);

	const { val: biomeModifiers } = config;

	const setBiomeModifiers = newConfig => {
		onUpdateConfig({
			type: 'biomeModifier',
			path: '',
			params: [],
			val: newConfig
		});
	};

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
					const name = capitalize(
						biomeInfoProvider.provide(biome).translated_name!
					);
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
