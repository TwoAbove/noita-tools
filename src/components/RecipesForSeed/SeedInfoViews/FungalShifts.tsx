import React from 'react';

import { Container, Stack } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';

import { FungalInfoProvider } from '../../../services/SeedInfo/infoHandler';
import GameInfoProvider from '../../../services/SeedInfo/infoHandler';

interface IFungalShiftsProps {
	fungalData: ReturnType<FungalInfoProvider['provide']>;
	infoProvider: GameInfoProvider;
}

const FungalShifts = (props: IFungalShiftsProps) => {
	const { fungalData, infoProvider } = props;

	const holdingAll =
		infoProvider.config.fungalHoldingFlasks.length &&
		infoProvider.config.fungalHoldingFlasks.findIndex(f => f === false) === -1;
	const toggleHoldingAll = () => {
		const newConfig = fungalData.map(() => !holdingAll);
		infoProvider.updateConfig({ fungalHoldingFlasks: newConfig });
	};

	const toggleHolding = (i: number) => {
		const newConfig = [...infoProvider.config.fungalHoldingFlasks];
		newConfig[i] = !newConfig[i];
		infoProvider.updateConfig({ fungalHoldingFlasks: newConfig });
	};

	return (
		<Container>
			<Table size="sm" bordered>
				<tbody>
					<tr>
						<td>
							<input
								checked={!!holdingAll}
								className="form-check-input"
								type="checkbox"
								id="holdingAll"
								onChange={() => toggleHoldingAll()}
							/>
						</td>
						<td>From</td>
						<td>To</td>
					</tr>
					{fungalData.map(([from, to], i) => {
						return (
							<tr key={i}>
								<td>
									<input
										className="form-check-input"
										type="checkbox"
										checked={
											infoProvider.config.fungalHoldingFlasks[i] || false
										}
										id="flexCheckDefault"
										onChange={() => toggleHolding(i)}
									/>
								</td>
								<td>
									<Stack>
										{from.map(f => (
											<div key={f}>
												{
													infoProvider.providers.material.provide(f)
														.translated_name
												}
											</div>
										))}
									</Stack>
								</td>
								<td className="align-middle">
									<div>
										{
											infoProvider.providers.material.provide(to)
												.translated_name
										}
									</div>
								</td>
							</tr>
						);
						// return (
						// 	<Stack key={i} direction="horizontal">
						// 		<Stack>
						// 			{from.map(f => (
						// 				<div key={f}>
						// 					{infoProviders.material.provide(f).translated_name}
						// 				</div>
						// 			))}
						// 		</Stack>
						// 		<Stack>
						// 			<div>{infoProviders.material.provide(to).translated_name}</div>
						// 		</Stack>
						// 	</Stack>
						// );
					})}
				</tbody>
			</Table>
		</Container>
	);
};

export default FungalShifts;
