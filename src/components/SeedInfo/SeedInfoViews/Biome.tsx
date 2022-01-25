import React from 'react';

import GameInfoProvider from '../../../services/SeedInfo/infoHandler';

import { Stack } from 'react-bootstrap';
import BiomeModifier from './BiomeMod';
import { BiomeModifierInfoProvider } from '../../../services/SeedInfo/infoHandler/InfoProviders/BiomeModifier';
import { BiomeInfoProvider } from '../../../services/SeedInfo/infoHandler/InfoProviders/Boime';

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
		<div className="d-flex justify-content-center">
			<div>
				<Stack
					gap={3}
					style={{
						width: '16rem',
						imageRendering: 'pixelated',
						minWidth: 'max-content',
						display: 'inline-flex',
						flexDirection: 'column'
					}}
					className="m-4"
				>
					{primaryBiomes.map(([biome, modifier], i) => {
						return <BiomeModifier key={i} biome={biome} modifier={modifier} />;
					})}
				</Stack>
			</div>
		</div>
	);
};

export default Biome;
