import { useState, useEffect } from 'react';
import { Button, Col, Container, Form, Row, Stack } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import SeedSolver from '../../../services/seedSolverHandler';
import useLocalStorage from '../../../services/useLocalStorage';
import UseMultithreadingButton from '../../SearchSeeds/UseMultithreading';
import { ComputeSocket } from '../ComputeSocket';


const Compute = () => {
	const [computeSocket, setComputeSocket] = useState<ComputeSocket>();

	const [useCores, setUseCores] = useLocalStorage('useCores', 1);
	const [startAutomatically, setStartAutomatically] = useLocalStorage('search-start-automatically', false);
	const [seedSolver, setSeedSolver] = useState<SeedSolver>();


	const [computeUrl, setComputeUrl] = useState(window.location.host);
	const [computeId, setComputeId] = useState('1234');

	const [connected, setConnected] = useState(false);
	const [computeRunning, setComputeRunning] = useState(false);

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
			}
		});
		if (startAutomatically) {
			newComputeSocket.start().catch(console.error);
		}
		setComputeSocket(newComputeSocket);
	}, [computeUrl, computeId, seedSolver, startAutomatically]);

	useEffect(() => {
		const newSeedSolver = new SeedSolver(useCores, false);
		setSeedSolver(newSeedSolver);
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
			<Row>
				<Col>{computeRunning ? "Running" : "Stopped"}</Col>
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
		</Container>
	);
};

export default Compute;
