import classNames from 'classnames';
import { useState, useEffect, FC } from 'react';
import { Button, Col, Collapse, Container, Form, FormGroup, ListGroup, ProgressBar, Row, Stack } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import humanize from 'humanize-duration';
import copy from 'copy-to-clipboard';

import { localizeNumber } from '../../../services/helpers';
import { ILogicRules } from '../../../services/SeedInfo/infoHandler/IRule';
import SeedSolver from '../../../services/seedSolverHandler';
import { Import } from '../../SearchSeeds/RuleList';
import ComputeHandler, { Status } from '../ComputeHandler';
import { ComputeSocket } from '../ComputeSocket';
import './console.css';

// const testConfig = {
// 	"id": "1",
// 	"type": "and",
// 	"rules": [
// 		{
// 			"id": "6",
// 			"type": "startingFlask",
// 			"path": "",
// 			"params": [],
// 			"val": "magic_liquid_movement_faster"
// 		},
// 		{
// 			"id": "15",
// 			"type": "startingSpell",
// 			"path": "",
// 			"params": [],
// 			"val": "RUBBER_BALL"
// 		},
// 		{
// 			"id": "22",
// 			"type": "startingBombSpell",
// 			"path": "",
// 			"params": [],
// 			"val": "MINE"
// 		}
// 	],
// 	"selectedRule": "search"
// };

const testConfig = {
	"id": "1",
	"type": "and",
	"rules": [
		{
			"id": "2",
			"type": "map",
			"val": {
				"coalmine": {
					"pos": {
						"x": 34,
						"y": 15
					},
					"search": [
						"data/biome_impl/coalmine/physics_swing_puzzle.png",
						"data/biome_impl/coalmine/receptacle_oil.png",
						"data/biome_impl/coalmine/oiltank_puzzle.png"
					],
					"funcs": [
						"load_pixel_scene2",
						"load_pixel_scene",
						"load_oiltank"
					]
				},
				"excavationSite": {
					"pos": {
						"x": 34,
						"y": 17
					},
					"search": [
						"data/biome_impl/excavationsite/meditation_cube.png",
						"data/biome_impl/excavationsite/receptacle_steam.png"
					],
					"funcs": [
						"spawn_meditation_cube",
						"load_pixel_scene4_alt"
					]
				},
				"snowCave": {
					"pos": {
						"x": 34,
						"y": 21
					},
					"search": [
						"data/biome_impl/snowcave/receptacle_water.png",
						"data/biome_impl/snowcave/buried_eye.png"
					],
					"funcs": [
						"load_pixel_scene",
						"load_pixel_scene3"
					]
				},
				"snowCastle": {
					"pos": {
						"x": 34,
						"y": 25
					},
					"search": [
						"data/biome_impl/snowcastle/kitchen.png"
					],
					"funcs": [
						"load_pixel_scene2"
					]
				},
				"vault": {
					"pos": {
						"x": 34,
						"y": 31
					},
					"search": [
						"data/biome_impl/vault/lab_puzzle.png"
					],
					"funcs": [
						"load_pixel_scene2"
					]
				}
			}
		}
	],
	"selectedRule": "search"
};

interface ChunkStatusProps {
	status: string;
	from: number;
	to: number;
}

const ChunkStatus: FC<ChunkStatusProps> = ({ status,
	from,
	to
}) => {
	return <div title={`${from} - ${to} ${status}`} className={classNames(['chunk-status', status])}></div>
}

interface ChunkStatusesProps {
	chunkStatuses: Status['chunkStatus'];
}
const ChunkStatuses: FC<ChunkStatusesProps> = ({ chunkStatuses }) => {
	return (<div className='d-flex flex-wrap justify-content-start align-items-start' style={{

	}}>
		{chunkStatuses.map(c => <ChunkStatus key={`${c.to}-${c.from}`} from={c.from} to={c.to} status={c.status} />)}
	</div>)
}

const ComputeConsole = () => {
	const [computeSocket, setComputeSocket] = useState<ComputeSocket>();
	const [connected, setConnected] = useState(false);
	const [openDetails, setOpenDetails] = useState(false);

	const [computeHandler, setComputeHandler] = useState<ComputeHandler>();

	const [computeUrl, setComputeUrl] = useState(window.location.host);
	const [computeId, setComputeId] = useState('1234');

	const [rules, setRules] = useState<ILogicRules>(testConfig as any);

	const [computeStatus, setComputeStatus] = useState<Status>({ running: false, chunkStatus: [], numberOfWorkers: 0, checked: 0, estimate: 0, rate: 0, results: [] });

	const [searchFrom, setSearchFrom] = useState(1);
	const [searchTo, setSearchTo] = useState(4_294_967_294);
	const [chunkSize, setChunkSize] = useState(100_000);

	useEffect(() => {
		const newComputeSocket = new ComputeSocket({
			url: computeUrl,
			computeId,
			onUpdate: () => {
				setConnected(newComputeSocket.connected);
				console.log('update');
			},
			isHost: true,
		});
		setComputeSocket(newComputeSocket);
	}, [computeUrl, computeId]);

	useEffect(() => {
		if (!computeSocket || !rules) {
			return;
		}
		console.log('');
		const newComputeHandler = new ComputeHandler(computeSocket, rules, { chunkSize, searchFrom, searchTo }, setComputeStatus);
		setComputeHandler(newComputeHandler);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [computeSocket, rules]);

	useEffect(() => {
		computeHandler?.updateConfig({
			chunkSize, searchFrom, searchTo
		})
	}, [chunkSize, computeHandler, searchFrom, searchTo]);

	const handleCopy = () => {
		const seedList = computeStatus.results;
		copy(seedList.join(','));
	}

	const nextUp = computeStatus.chunkStatus.find(c => c.status === 'waiting');

	return (
		<Container>
			<Row>
				<Col xs={12} sm={6}>
					Import search
					<Import onClick={rules => {
						const newRules = JSON.parse(atob(rules));
						setRules(newRules);
					}} />
					<Form onSubmit={e => e.preventDefault()}>
						<FormGroup>
							<Col>
								<Form.Group className=''>
									<Form.Label htmlFor="SearchSeeds.seed">
										Start search from seed:{' '}
									</Form.Label>
									<Form.Control
										id="SearchSeeds.seed"
										type="number"
										disabled={computeStatus.running}
										value={searchFrom}
										onChange={e => setSearchFrom(parseInt(e.target.value, 10))}
									/>
								</Form.Group>
							</Col>
							<Col>
								<Form.Group className='mt-3'>
									<Form.Label htmlFor="SearchSeeds.seedEnd">
										End search at seed:{' '}
									</Form.Label>
									<Form.Control
										id="SearchSeeds.seedEnd"
										type="number"
										placeholder="Optional"
										disabled={computeStatus.running}
										value={searchTo}
										onChange={e => setSearchTo(parseInt(e.target.value, 10))}
									/>
								</Form.Group>
							</Col>
							{/* <Col>
							<Form.Group className='mt-3'>
								<Form.Check
									checked={findAll}
									onChange={e => {
										setFindAll(e.target.checked);
									}}
									id={`find-all-switch`}
									label="Don't stop searching when a seed is found"
								/>
							</Form.Group>
						</Col> */}
						</FormGroup>
					</Form>
				</Col>
				<Col xs={12} sm={6} >
					Current config:
					<pre style={{ height: "30rem" }} className='overflow-auto'><code>{JSON.stringify(rules, null, 2)}</code></pre>
				</Col>
			</Row>
			<Container>
				<Row>
					<Col>
						<Form.Group>
							<Form.Label>Compute URL</Form.Label>
							<Form.Control value={computeUrl} onChange={(e) => setComputeUrl(e.target.value)} />
							<Form.Text>{connected ? "Connected" : "Not Connected"}</Form.Text>
						</Form.Group>
					</Col>
					<Col>
						<Form.Group>
							<Form.Label>Compute Room</Form.Label>
							<Form.Control value={computeId} onChange={(e) => setComputeId(e.target.value)} />
						</Form.Group>
					</Col>
					<Col>
						<Form.Group>
							<Form.Label>Chunk Size</Form.Label>
							<Form.Control value={chunkSize} type='number' onChange={(e) => setChunkSize(parseInt(e.target.value, 10))} />
							<Form.Text className="text-muted">
								The amount of seeds that will be sent to a compute worker at one time.
								Larger values are more stable. Recommended not to change.
							</Form.Text>
						</Form.Group>
					</Col>
				</Row>
			</Container>
			<hr />
			<Row>
				<Col>
					<Button disabled={computeStatus.running} onClick={() => computeHandler?.start()}>Start</Button>
				</Col>
				<Col>
					<Button disabled={!computeStatus.running} onClick={() => computeHandler?.stop()}>Stop</Button>
				</Col>
			</Row>
			<hr />
			<Container>
				<Row>
					{nextUp && computeStatus.estimate && <div>
						<ProgressBar min={searchFrom} max={searchTo} now={nextUp?.from} animated label={`${Math.round(computeStatus.checked * 100 / (searchTo - searchFrom))}%`} />
						Seeds checked: {localizeNumber(computeStatus.checked)} / {localizeNumber(searchTo - searchFrom)} (Estimated time left: {humanize(computeStatus.estimate * 1000, { round: true, units: ["h", "m"] })}, {localizeNumber(Math.round(computeStatus.rate * 100) / 100)} avg seeds/s)
					</div>

					}
					<Col xs={4}>
						Workers Connected: {computeStatus.numberOfWorkers}
					</Col>
					{nextUp &&
						<Col xs={4}>
							Next up: Chunk [{nextUp?.from} - {nextUp?.to}]
						</Col>
					}
				</Row>
				<Row>
					<h6>Results:</h6>
					{<div>
						Found {computeStatus.results.length} seeds: <br />
						<Button onClick={handleCopy}>Copy seed list to clipboard</Button>
						<ListGroup style={
							{
								overflowY: 'auto',
								height: '100px',
							}
						}>
							{computeStatus.results.map(s => {
								return <ListGroup.Item variant="flush" key={s}>{s}</ListGroup.Item>
							})}
						</ListGroup>
					</div>}
				</Row>
				<Row>
					<Row>
						<Col>
							<Button onClick={() => setOpenDetails(!openDetails)}>Show Details (laggy)</Button>
						</Col>
					</Row>
					<Collapse mountOnEnter unmountOnExit in={openDetails}>
						<div>
							<hr />
							<ChunkStatuses chunkStatuses={computeStatus.chunkStatus} />
							<hr />
						</div>
					</Collapse>
				</Row>
			</Container>
		</Container>
	);
};

export default ComputeConsole;
