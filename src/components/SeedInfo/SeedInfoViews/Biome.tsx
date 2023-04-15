import React from 'react';

import GameInfoProvider from '../../../services/SeedInfo/infoHandler';

import { Col, Row, Stack } from 'react-bootstrap';
import BiomeModifier from './BiomeMod';
import { BiomeModifierInfoProvider } from '../../../services/SeedInfo/infoHandler/InfoProviders/BiomeModifier';
import { BiomeInfoProvider } from '../../../services/SeedInfo/infoHandler/InfoProviders/Biome';

interface IBiomeProps {
	biomeData: ReturnType<BiomeModifierInfoProvider['provide']>;
	infoProvider: GameInfoProvider;
}

const biomeInfoProvider = new BiomeInfoProvider({} as any);

const Biome = (props: IBiomeProps) => {
	const { biomeData } = props;

	const primaryBiomes = Object.entries(biomeData).filter(
		([biome, modifier]) => {
			const isPrimary = biomeInfoProvider.isPrimary(biome);
			return isPrimary && modifier;
		}
	);

	return (
		<Stack gap={1}>
			{primaryBiomes.map(([biome, modifier], i) => {
				return (
					<Col
						key={biome}
						className="mt-3"
						style={{
							width: '16rem',
							imageRendering: 'pixelated',
							minWidth: 'max-content',
							display: 'inline-flex',
							flexDirection: 'column'
						}}
					>
						<BiomeModifier biome={biome} modifier={modifier} />
					</Col>
				);
			})}
		</Stack>
	);
};

export default Biome;
