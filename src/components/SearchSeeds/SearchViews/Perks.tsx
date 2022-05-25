/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, FC } from 'react';
import { Row, Col, Container, Stack, Button } from 'react-bootstrap';

import classNames from 'classnames';
import Clickable from '../../Icons/Clickable';
import PerkSelect from '../../PerkSelect';
import Icon from '../../Icons/Icon';
import { Square } from '../../helpers';
import { IRule } from '../../../services/SeedInfo/infoHandler/IRule';
import Perk from '../../Icons/Perk';
import { PerkInfoProvider } from '../../../services/SeedInfo/infoHandler/InfoProviders/Perk';

const perkInfoProvider = new PerkInfoProvider({} as any);

interface IPerksProps {
	onUpdateConfig: (config: Partial<IRule>) => void;
	config: IRule;
}

const getMaxPerksPerRow = (perks: string[][]): number[] => {
	const res: number[] = [];
	let ppr = 3; // default
	perks.forEach((row, i) => {
		res.push(ppr);
		const extraPerk = row.filter(r => r === 'EXTRA_PERK').length;
		ppr += extraPerk;
	});
	return res;
};

const Perks: FC<IPerksProps> = ({ onUpdateConfig, config }) => {
	const { val: perks } = config;
	const [selectOpen, setSelectOpen] = useState(-1);

	const setPerks = newConfig => {
		onUpdateConfig({
			type: 'perk',
			path: '',
			params: [],
			strict: true,
			val: newConfig
		});
	};

	const maxPerksPerRow = perks.map(p => 3);

	const handleAdd = perkId => {
		// The regular [...] keeps refs to the old arrays, so need to copy
		const newPerks = perks.map(p => p.slice());
		newPerks[selectOpen].push(perkId);
		setPerks(newPerks);
		if (newPerks[selectOpen].length >= maxPerksPerRow[selectOpen]) {
			setSelectOpen(-1);
		}
		// setPerks(i);
	};

	const handleDelete = (perkId, row) => {
		// The regular [...] keeps refs to the old arrays, so need to copy
		const newPerks = perks.map(p => p.slice());
		const index = newPerks[row].indexOf(perkId);
		if (index === -1) {
			return;
		}
		newPerks[row].splice(index, 1);

		// Handle EXTRA_PERK perk being removed
		if (perkId !== 'EXTRA_PERK') {
			setPerks(newPerks);
			return;
		}
		// We don't need to do anything if it's the last level
		if (row === newPerks.length - 1) {
			setPerks(newPerks);
			return;
		}

		for (let i = row + 1; i < newPerks.length; i++) {
			// Only do something if we are at max
			if (newPerks[i].length !== maxPerksPerRow[i]) {
				continue;
			}
			newPerks[i] = newPerks[i].slice(0, -1);
		}
		setPerks(newPerks);
	};

	const togglePerkSelect = (n = 0) => {
		setSelectOpen(n);
	};

	return (
		<Container fluid>
			<p>
				To delete a perk, click on it. <br />
				Compute-intensive. Use sparingly!
			</p>
			<Row className="justify-content-center">
				<Col xs={7}>
					<Stack gap={3}>
						{perks.map((row, i) => {
							return (
								<Row
									className="justify-content-center align-items-center"
									key={i}
								>
									<Col xs={3}>Level {i + 1}</Col>
									<Col>
										<Stack gap={3} direction="horizontal">
											{row.map(perkId => {
												return (
													<Perk
														key={perkId}
														onClick={() => handleDelete(perkId, i)}
														perk={perkInfoProvider.perks[perkId]}
													/>
												);
											})}
										</Stack>
									</Col>
									<Col className="me-auto">
										{maxPerksPerRow[i] > row.length ? (
											<Button onClick={() => togglePerkSelect(i)}>
												<Square>Add Perk</Square>
											</Button>
										) : (
											<Square>&nbsp;</Square>
										)}
									</Col>
								</Row>
							);
						})}
					</Stack>
				</Col>
			</Row>
			<PerkSelect
				selected={perks[selectOpen]}
				handleOnClick={perkId => handleAdd(perkId)}
				show={selectOpen >= 0}
				handleClose={() => togglePerkSelect(-1)}
			/>
		</Container>
	);
};

export default Perks;
