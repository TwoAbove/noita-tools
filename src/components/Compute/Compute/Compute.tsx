import { useState, useEffect } from 'react';
import { Button, Col, Container, Form, Row, Stack } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import humanize from 'humanize-duration';

import SeedSolver from '../../../services/seedSolverHandler';
import useLocalStorage from '../../../services/useLocalStorage';
import UseMultithreadingButton from '../../SearchSeeds/UseMultithreading';
import { ComputeSocket } from '../ComputeSocket';
import { localizeNumber } from '../../../services/helpers';


const Compute = () => {
	const [computeSocket, setComputeSocket] = useState<ComputeSocket>();

	const [useCores, setUseCores] = useLocalStorage('useCores', 1);
	const [startAutomatically, setStartAutomatically] = useLocalStorage('search-start-automatically', false);
	const [seedSolver, setSeedSolver] = useState<SeedSolver>();


	const [computeUrl, setComputeUrl] = useState(window.location.host);
	const [computeId, setComputeId] = useLocalStorage('search-compute-id', '');

	const [connected, setConnected] = useState(false);
	const [computeRunning, setComputeRunning] = useState(false);
	const [computeInfo, setComputeInfo] = useState<any>({});

	useEffect(() => {
		if (!seedSolver) {
			// not ready
			return;
		}
		const newComputeSocket = new ComputeSocket({
			url: computeUrl,
			computeId,
			seedSolver,
			onUpdate: () => {
				setConnected(newComputeSocket.connected);
				setComputeRunning(newComputeSocket.running);
				setComputeInfo({
					jobName: newComputeSocket.jobName,
					chunkTo: newComputeSocket.chunkTo,
					chunkFrom: newComputeSocket.chunkFrom,
					jobStats: newComputeSocket.jobStats
				})
			}
		});
		if (startAutomatically) {
			newComputeSocket.start().catch(e => {
				console.error(e);
				newComputeSocket.stop();
			});
		}
		setComputeSocket(newComputeSocket);

		return (() => {
			newComputeSocket.stop();
		});
	}, [computeUrl, computeId, seedSolver, startAutomatically]);

	useEffect(() => {
		const newSeedSolver = new SeedSolver(useCores, false);
		setSeedSolver(newSeedSolver);
		return (() => {
			newSeedSolver.destroy();
		});
	}, [useCores]);

	return (
		<Container>
			<Row>{connected ? 'Connected' : 'Not Connected'} </Row>
			<Container>
				<Row>
					<Col>
						<Form.Group>
							<Form.Label>Compute URL</Form.Label>
							<Form.Control value={computeUrl} onChange={(e) => setComputeUrl(e.target.value)} />
						</Form.Group>
					</Col>
					<Col>
						<Form.Group>
							<Form.Label>Compute Room</Form.Label>
							<Form.Control value={computeId} onChange={(e) => setComputeId(e.target.value)} />
						</Form.Group>
					</Col>
				</Row>
			</Container>
			<hr />
			<Stack gap={3}>
				<Row>
					<Col md={3}>{computeRunning ? "Running" : "Stopped"}</Col>
				</Row>
				<Row>
					{computeRunning
						&&
						<Col md={8}>
							{computeInfo.jobName ?
								<Col>
									<Col>Working on job: {computeInfo.jobName}</Col>
									<Col>Chunk {localizeNumber(computeInfo.chunkFrom)} - {localizeNumber(computeInfo.chunkTo)}</Col>
									<Col className='text-muted fw-lighter'>Cluster stats: Seeds checked: {localizeNumber(computeInfo.jobStats.checked)} (Estimated time left: {humanize(computeInfo.jobStats.estimate * 1000, { round: true, units: ["h", "m"] })}, {localizeNumber(Math.round(computeInfo.jobStats.rate * 100) / 100)} avg seeds/s)</Col>
								</Col> : <Col>Waiting for next job</Col>
							}
						</Col>
					}
				</Row>
				<Row>
					<Col>
						<Form.Group>
							<Form.Label>Start automatically</Form.Label>
							<Form.Check type="switch" checked={startAutomatically as any} onChange={() => setStartAutomatically(!startAutomatically)} />
						</Form.Group>
					</Col>
					<Col>
						<UseMultithreadingButton />
					</Col>
					<Col>
						<Button disabled={computeRunning} onClick={() => computeSocket?.start()}>Start</Button>
					</Col>
					<Col>
						<Button disabled={!computeRunning} onClick={() => computeSocket?.stop()}>Stop</Button>
					</Col>
				</Row>
			</Stack>
		</Container>
	);
};

const withSupport = (props) => {
	if (typeof OffscreenCanvas === "undefined") {
		return (
			<Container>
				<p>
					Compute not supported on this device.
					<br />
					If you are on a mobile apple device, they are not supported.
					<br />
					If on an apple desktop device, please use a Chromium browser (Chrome, edge, etc.) or Firefox.
				</p>
			</Container>
		);
	}
	return <Compute {...props} />;
}

export default withSupport;
