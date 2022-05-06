import React, { useState } from 'react';
import {
	Table,
	Button,
	Col,
	Modal,
	Row,
	Stack
} from 'react-bootstrap';

import SeedForm from './SeedForm';
import SeedDataOutput from './SeedDataOutput';
import { db } from '../../services/db';
import { useLiveQuery } from 'dexie-react-hooks';

const SeedHistoryModal = props => {
	const { show, handleClose, onSelectSeed } = props;

	const seeds = (useLiveQuery(() => db.seedInfo.toArray(), [], [])).sort(
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

const SeedData = () => {
	const [seed, setSeed] = React.useState<any>('');

	const [showHistory, setShowHistory] = React.useState(false);

	return (
		<div className="px-sm-3 px-2 pb-3 mb-5">
			<SeedHistoryModal
				show={showHistory}
				handleClose={() => setShowHistory(false)}
				onSelectSeed={seed => setSeed(seed)}
			/>
			<Row className="align-items-center">
				<Col>
					<h4 className="pt-3">Seed info</h4>
					<p>
						Get lots of information about a seed, like perks in holy mountains,
						fungal shifts, etc.
					</p>
				</Col>
				<Col xs="auto">
					<Button
						className="me-3"
						variant="outline-secondary"
						size="sm"
						onClick={() => setShowHistory(true)}
					>
						Seed History
					</Button>
				</Col>
			</Row>
			<Stack>
				<SeedForm onSubmit={seed => setSeed(seed)} />
				{seed ? <SeedDataOutput seed={seed} /> : null}
			</Stack>
		</div>
	);
};

export default SeedData;
