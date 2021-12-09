import React from 'react';
import { BiomeModifierInfoProvider } from '../../../services/SeedInfo/infoHandler';
import GameInfoProvider from '../../../services/SeedInfo/infoHandler';
import { capitalize } from '../../../services/helpers';

import { Stack } from 'react-bootstrap';

interface IBiomeProps {
	biomeData: ReturnType<BiomeModifierInfoProvider['provide']>;
	infoProvider: GameInfoProvider;
}

const Biome = (props: IBiomeProps) => {
	const { biomeData, infoProvider } = props;

	const primary = Object.entries(biomeData).filter(([biome, modifier]) => {
		const isPrimary = infoProvider.providers.biome.isPrimary(biome);
		return isPrimary && modifier;
	});

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
					{primary.map(([biome, modifier], i) => {
						return (
							<div
								style={{
									position: 'relative',
									width: '100%',
									height: '6.5rem',
									justifyContent: 'center',
									textAlign: 'center'
								}}
								key={i}
							>
								<span>
									{capitalize(infoProvider.providers.biome.translate(biome))}
								</span>

								<div
									className="d-flex"
									style={{
										height: '5rem',
										width: '100%',
										bottom: 0,
										position: 'absolute',
										minWidth: 'max-content',
										flexDirection: 'row',
										display: 'flex'
									}}
								>
									<div
										style={{
											width: '100%',
											backgroundSize: 'cover',
											backgroundRepeat: 'no-repeat',
											backgroundImage: `url('data:image/png;base64,${modifier!.ui_decoration_file
												}')`
										}}
									></div>
									<div
										style={{
											width: '100%',
											backgroundSize: 'cover',
											backgroundRepeat: 'no-repeat',
											backgroundImage: `url('data:image/png;base64,${modifier!.ui_decoration_file
												}')`,
											backgroundPositionX: '50%'
											// backgroundSize: '200% 100%',
										}}
									></div>
									<div
										style={{
											width: '100%',
											backgroundSize: 'cover',
											backgroundRepeat: 'no-repeat',
											backgroundImage: `url('data:image/png;base64,${modifier!.ui_decoration_file
												}')`,
											backgroundPositionX: '100%'
										}}
									></div>
								</div>
								<div
									style={{
										height: '5rem',
										paddingLeft: '3.5rem',
										paddingRight: '3.5rem',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										textAlign: 'center'
									}}
								>
									<span
										style={{
											zIndex: 10
										}}
									>
										{capitalize(modifier!.id.replace(/_/g, ' '))}
									</span>
								</div>
							</div>
						);
					})}
				</Stack>
			</div>
		</div>
	);
};

export default Biome;
