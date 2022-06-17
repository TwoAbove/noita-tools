import React, { useState } from 'react';
import {
	Table,
	Button,
	Col,
	Modal,
	Row,
	Stack,
	ListGroup
} from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import SeedForm from './SeedForm';
import SeedDataOutput from './SeedDataOutput';
import { db } from '../../services/db';
import { useLiveQuery } from 'dexie-react-hooks';
import Spell from '../Icons/Spell';
import { SpellInfoProvider } from '../../services/SeedInfo/infoHandler/InfoProviders/Spell';
import FungalShifts from './SeedInfoViews/FungalShifts';
import { MaterialInfoProvider } from '../../services/SeedInfo/infoHandler/InfoProviders/Material';
import i18n from '../../i18n';
import { ShowAlwaysCastRow } from '../Settings/GeneralSettings';

const MemoSeedDataOutput = React.memo(SeedDataOutput);

const SeedHistoryModal = props => {
	const { show, handleClose, onSelectSeed } = props;

	const seeds = useLiveQuery(() => db.seedInfo.toArray(), [], []).sort(
		(a, b) => +b.updatedAt - +a.updatedAt
	);

	const [clicked, setClicked] = useState<number | null>(null);

	return (
		<Modal size="lg" show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Seed History</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Table responsive striped borderless hover>
					<thead>
						<tr>
							<th>Seed</th>
							<th>Last updated</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{seeds.map((seed, i) => {
							const dateString = seed.updatedAt.toLocaleString();
							return (
								<tr
									style={{ cursor: 'pointer' }}
									onClick={() => onSelectSeed(seed.seed)}
									key={seed.seed}
								>
									<td className="text-primary">
										<Button size="sm" variant="outline-primary">
											{seed.seed}
										</Button>
									</td>
									<td>{dateString}</td>
									<td>
										{clicked !== i ? (
											<Button
												variant="outline-warning"
												onClick={e => {
													e.stopPropagation();
													e.preventDefault();
													setClicked(i);
												}}
												size="sm"
											>
												delete
											</Button>
										) : (
											<Button
												variant="danger"
												onClick={e => {
													e.stopPropagation();
													e.preventDefault();
													setClicked(null);
													db.seedInfo.get({ seed: seed.seed }).then(q => {
														if (!q) return;
														db.seedInfo.delete(q.id!);
													});
												}}
												size="sm"
											>
												delete
											</Button>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

const spellInfoProvider = new SpellInfoProvider({} as any);
const materialProvider = new MaterialInfoProvider(i18n);

const spellsToShow = new Set<string>();
spellInfoProvider.spellsArr
	.filter(s => {
		return s.type === 'ACTION_TYPE_PROJECTILE' && s.spawn_probabilities[6]! > 0;
	})
	.map(s => s.id)
	.forEach(item => spellsToShow.add(item));
['DAMAGE', 'CRITICAL_HIT', 'HOMING', 'SPEED', 'ACID_TRAIL', 'SINEWAVE'].forEach(
	item => spellsToShow.add(item)
);

const QuirkModal = props => {
	const { show, handleClose } = props;

	return (
		<Modal
			fullscreen="sm-down"
			size="lg"
			scrollable
			show={show}
			onHide={handleClose}
		>
			<Modal.Header closeButton>
				<Modal.Title>Quirks and Limitations</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<h4>Perk Rerolls</h4>
				<p>
					Due to how perks are re-rolled in-game, the only guarantee is the
					perks that you will get, <b>not their position</b>. <br />
					<br />
					When looking at <i>always cast</i> and <i>perk lottery</i> info,
					please note that they are <b>position</b>-dependent, not
					perk-dependent. That means that if the position of <i>always cast</i>{' '}
					in-tool is different from that in-game, then the value will be
					different. As a non-perfect solution, please enable "show always-cast
					for whole row" in the settings (shortcut below).
				</p>
				<ListGroup variant="flush" className="mt-0 mb-3 shadow">
					<ListGroup.Item>
						<ShowAlwaysCastRow />
					</ListGroup.Item>
				</ListGroup>
				<h4>Always Cast</h4>
				<p>
					The probabilities in the{' '}
					<a
						href="https://noita.fandom.com/wiki/Perks"
						rel="noreferrer"
						target="_blank"
					>
						Noita wiki
					</a>{' '}
					are incorrect, as there is a bug in the Noita code that does not
					enable any random tier 6 modifier, static projectile, and utility
					spells to be added to the wands. <br />
					<br /> The only ones available are:
				</p>
				<div className="d-flex align-content-start flex-wrap pb-3">
					{[...spellsToShow].map(s => (
						<div className="m-1 p-0 " key={s}>
							<Spell id={s} />
						</div>
					))}
				</div>
				<h4>Fungal Shifts</h4>
				<p>
					Not all Fungal Shifts are created equal. Sometimes, you can get shifts
					that look like this:
				</p>
				<FungalShifts
					fungalData={[
						{
							flaskTo: false,
							flaskFrom: false,
							from: ['sand'],
							to: 'sand'
						},
						{
							flaskTo: true,
							flaskFrom: false,
							from: ['water'],
							to: 'water'
						},
						{
							flaskTo: false,
							flaskFrom: true,
							from: ['lava'],
							to: 'lava'
						}
					]}
					infoProvider={
						{
							// stub for this example
							updateConfig: () => {},
							config: { fungalShifts: [false, true, true] },
							providers: {
								material: materialProvider
							}
						} as any
					}
				/>
				<p>
					These shifts will not shift anything unless you are holding a flask
					and there is the flask indicator. In the examples above, only the
					second and third row will be a successful shift, if you have a flask
					equipped.
				</p>
			</Modal.Body>
		</Modal>
	);
};

const SeedData = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const seedInSeachParams = searchParams.get('seed');
	const [seed, setSeed] = React.useState<any>(() => seedInSeachParams || '');

	const [open, setOpen] = React.useState(false);

	const handleSetSeed = (newSeed: string) => {
		setSeed(newSeed);
		setSearchParams({ seed: newSeed });
	};

	const [showHistory, setShowHistory] = React.useState(false);

	return (
		<div className="px-sm-3 px-2 pb-3 mb-5">
			<SeedHistoryModal
				show={showHistory}
				handleClose={() => setShowHistory(false)}
				onSelectSeed={seed => handleSetSeed(seed)}
			/>
			<Row className="align-items-center">
				<Col xs="8">
					<h4 className="pt-3">Seed info</h4>
					<Row>
						<Col xs={6} md="auto">
							<p>
								Get lots of information about a seed, like perks in holy
								mountains, fungal shifts, etc.
							</p>
						</Col>
						<Col>
							<p>
								Note that this tool has minor limitations in details of
								generation: <br />{' '}
								<Button
									className="align-self-baseline mt-1"
									variant="outline-primary"
									size="sm"
									onClick={() => setOpen(true)}
								>
									Show quirks
								</Button>
								<QuirkModal show={open} handleClose={() => setOpen(false)} />
							</p>
						</Col>
					</Row>
				</Col>
				<Col xs="4" className="d-flex">
					<Button
						className="ms-auto"
						variant="outline-secondary"
						size="sm"
						onClick={() => setShowHistory(true)}
					>
						Seed History
					</Button>
				</Col>
			</Row>
			<Stack>
				<SeedForm onSubmit={seed => handleSetSeed(seed)} />
				{seed ? <MemoSeedDataOutput seed={seed} /> : null}
			</Stack>
		</div>
	);
};

export default SeedData;
