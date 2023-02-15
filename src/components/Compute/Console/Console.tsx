import classNames from 'classnames';
import { useState, useEffect, FC, useRef } from 'react';
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
import useLocalStorage from '../../../services/useLocalStorage';

const testConfig = {
	"id": "1",
	"type": "and",
	"rules": [
		{
			"id": "2",
			"type": "map",
			"val": {
				"excavationSite": {
					"pos": {
						"x": 34,
						"y": 17
					},
					"searchType": "and",
					"search": [
						"data/biome_impl/excavationsite/meditation_cube.png",
						"data/biome_impl/excavationsite/receptacle_steam.png"
					],
					"funcs": [
						"spawn_meditation_cube",
						"load_pixel_scene4_alt"
					]
				},
				"coalmine": {
					"pos": {
						"x": 34,
						"y": 15
					},
					"searchType": "and",
					"search": [
						"data/biome_impl/coalmine/receptacle_oil.png",
					],
					"funcs": [
						"load_pixel_scene2",
					]
				},
				"snowCastle": {
					"pos": {
						"x": 34,
						"y": 25
					},
					"searchType": "or",
					"search": [
						"data/biome_impl/snowcastle/kitchen.png",
						"data/biome_impl/snowcastle/sauna.png"
					],
					"funcs": [
						"load_pixel_scene2"
					]
				},
				"snowCave": {
					"pos": {
						"x": 34,
						"y": 21
					},
					"searchType": "and",
					"search": [
						"data/biome_impl/snowcave/receptacle_water.png",
						"data/biome_impl/snowcave/buried_eye.png"
					],
					"funcs": [
						"load_pixel_scene",
						"load_pixel_scene3"
					]
				},
				"vault": {
					"pos": {
						"x": 34,
						"y": 31
					},
					"searchType": "and",
					"search": [
						"data/biome_impl/vault/lab_puzzle.png"
					],
					"funcs": [
						"load_pixel_scene2"
					]
				},
			}
		}
	],
	"selectedRule": "search"
};

interface ChunkStatusesProps {
	chunkStatuses?: ComputeHandler['chunkStatus'];
}
const ChunkStatuses: FC<ChunkStatusesProps> = ({ chunkStatuses = [] }) => {
	const pending = chunkStatuses.filter(c => c.status === 'pending');
	// const waiting = chunkStatuses.filter(c => c.status === 'waiting');
	// const done = chunkStatuses.filter(c => c.status === 'done');
	return (
		<Stack>
			<Col>Working on: <Stack gap={3} direction='horizontal'>{pending.map(p => <div className='p-2' key={p.chunkId}>{p.chunkId} <br /> [{p.from} - {p.to}]</div>)}</Stack></Col>
			{/* <Col>Waiting: {waiting.length}</Col> */}
			{/* <Col>Done: {done.length}</Col> */}
		</Stack>
	)
}

const ComputeConsole = () => {
	const [computeSocket, setComputeSocket] = useState<ComputeSocket>();
	const [connected, setConnected] = useState(false);
	const [openDetails, setOpenDetails] = useState(false);

	const [computeHandler, setComputeHandler] = useState<ComputeHandler>();

	// const [computeUrl, setComputeUrl] = useState("https://dev.noitool.com");
	const [computeUrl, setComputeUrl] = useState(window.location.host);
	const [computeId, setComputeId] = useLocalStorage('search-compute-id', '');
	const [computeJobName, setComputeJobName] = useState("The Seed");
	// const [computeJobName, setComputeJobName] = useState((Math.random() + 1).toString(36).substring(7));

	const [rules, setRules] = useState<ILogicRules>(testConfig as any);

	const [computeStatus, setComputeStatus] = useState<Status>({ running: false, checked: 0, estimate: 0, rate: 0, results: [] });

	const [searchFrom, setSearchFrom] = useState(1);
	// const [searchTo, setSearchTo] = useState(10_000_000);
	const [searchTo, setSearchTo] = useState(2_147_483_645);
	const [chunkSize, setChunkSize] = useState(2000);

	useEffect(() => {
		const newComputeSocket = new ComputeSocket({
			url: computeUrl,
			computeId,
			onUpdate: () => {
				setConnected(newComputeSocket.connected);
			},
			isHost: true,
		});
		setComputeSocket(newComputeSocket);
	}, [computeUrl, computeId]);

	useEffect(() => {
		if (!computeSocket || !rules) {
			return;
		}
		const newComputeHandler = new ComputeHandler(computeSocket, rules, { chunkSize, searchFrom, searchTo }, setComputeStatus);
		setComputeHandler(newComputeHandler);
		return (() => {
			newComputeHandler.destruct();
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [computeSocket, rules]);

	useEffect(() => {
		computeHandler?.updateConfig({
			chunkSize, searchFrom, searchTo, jobName: computeJobName
		})
	}, [chunkSize, computeHandler, searchFrom, searchTo, computeJobName]);

	const handleCopy = () => {
		const seedList = computeStatus.results;
		copy(seedList.join(','));
	}

	const nextUp = computeHandler?.chunkStatus.find(c => c.status === 'waiting');

	return (
		<Container>
			<Stack gap={1}>
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
							</FormGroup>
						</Form>
					</Col>
					<Col xs={12} sm={6} >
						Current config:
						<pre style={{ height: "30rem" }} className='overflow-auto'><code>{JSON.stringify(rules, null, 2)}</code></pre>
					</Col>
				</Row>
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
							<Form.Label>Compute Job Name</Form.Label>
							<Form.Control value={computeJobName} onChange={(e) => setComputeJobName(e.target.value)} />
						</Form.Group>
					</Col>
					<Col>
						<Form.Group>
							<Form.Label>Chunk Size</Form.Label>
							<Form.Control value={chunkSize} type='number' onChange={(e) => setChunkSize(parseInt(e.target.value, 10))} />
							<Form.Text className="text-muted">
								The amount of seeds that will be sent to a compute worker at one time.
								Larger values are more stable, but will use more memory on compute machines.
								Recommended not to change.
							</Form.Text>
						</Form.Group>
					</Col>
				</Row>
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
				<Stack gap={3}>
					<Row>
						{nextUp && computeStatus.estimate && <div>
							<ProgressBar min={searchFrom} max={searchTo} now={nextUp?.from} animated label={`${Math.round(computeStatus.checked * 100 / (searchTo - searchFrom))}%`} />
							Seeds checked: {localizeNumber(computeStatus.checked)} / {localizeNumber(searchTo - searchFrom)} (Estimated time left: {humanize(computeStatus.estimate * 1000, { round: true, units: ["h", "m"] })}, {localizeNumber(Math.round(computeStatus.rate * 100) / 100)} avg seeds/s)
						</div>

						}
						{nextUp &&
							<Col xs={4}>
								Next up: Chunk [{nextUp?.from} - {nextUp?.to}]
							</Col>
						}
					</Row>
					<ChunkStatuses chunkStatuses={computeHandler?.chunkStatus} />
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
				</Stack>
			</Stack>
		</Container>
	);
};

export default ComputeConsole;
