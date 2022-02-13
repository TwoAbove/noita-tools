import React from 'react';
import {
	ButtonGroup,
	Form,
	FormGroup,
	Container,
	Stack,
	// Input,
	// Label,
	Row,
	Col,
	Button,
	ProgressBar
} from 'react-bootstrap';

import humanize from 'humanize-duration';

import SeedDataOutput from '../SeedInfo/SeedDataOutput';
import SeedSolver from '../../services/seedSolverHandler';

import RuleConstructor from './RuleConstructor';
import useLocalStorage from '../../services/useLocalStorage';
import { localizeNumber } from '../../services/helpers';

const Description = () => {
	return (
		<>
			<h4 className="mb-3">Find a seed with desired parameters</h4>
			<p>Additional seed search parameters and a better UI coming soon!</p>
		</>
	);
};

const avg = (arr: number[]) => arr.reduce((p, c) => p + c, 0) / arr.length;

const SearchSeeds = () => {
	const [useCores, setUseCores] = useLocalStorage('useCores', 1, s => parseInt(s || "1", 10), t => `${t}`)
	const [seedSolver, setSeedSolver] = React.useState(
		() => new SeedSolver(useCores)
	);
	const [seed, setSeed] = React.useState('1');
	const [seedEnd, setSeedEnd] = React.useState('');
	const handleSeedStartChange = (e: any) => {
		setSeed(e.target.value);
	};
	const handleSeedEndChange = (e: any) => {
		setSeedEnd(e.target.value);
	};

	const [solverInfo, setSolverInfo] = React.useState<
		ReturnType<SeedSolver['getInfo']>
	>([]);
	const running = solverInfo.find(info => info.running) !== undefined;

	const handleMultithreading = () => {
		const concurrency = navigator.hardwareConcurrency || 1;
		if (concurrency > 1) {
			setUseCores(concurrency - 1);
		}
		if (useCores > 1) {
			setUseCores(1);
		}
	};

	React.useEffect(() => {
		const update = async () => {
			const info = seedSolver.getInfo();
			if (info.length) {
				setSolverInfo(info);
			}
		};

		const id = setInterval(() => update(), 1000);
		return () => clearInterval(id);
	}, [seedSolver]);

	React.useEffect(() => {
		const work = async () => {
			await seedSolver.destroy();
			const newSeedSolver = new SeedSolver(useCores);
			const newSeed = parseInt(seed);
			const newSeedEnd = parseInt(seedEnd);
			newSeedSolver.update({
				rules: [],
				currentSeed: newSeed,
				seedEnd: newSeedEnd,
			});
			if (!isNaN(newSeed)) {
				newSeedSolver.update({
					currentSeed: newSeed,
					seedEnd: newSeedEnd,
				});
			}

			setSeedSolver(newSeedSolver);
		};
		work(); // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [useCores, seed, seedEnd]);
	// ^
	// seedSolver is both used and set here, so running this
	// again will create a loop
	// useEffect is used here idiomatically, but I'm not sure how to better do this

	const updateRules = (rules) => {
		seedSolver.update({
			rules,
		});
	}

	const startCalculation = async () => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({})
		};
		fetch('/data', requestOptions);

		await seedSolver.start();
	};

	const stopCalculation = async () => {
		await seedSolver.stop();
	};

	const seedsChecked = avg(solverInfo.map(i => i.currentSeed));
	const totalSeeds = 4_294_967_294;
	const percentChecked = Math.floor((seedsChecked / totalSeeds) * 100);

	return (
		<Container className="col container shadow-lg">
			<Description />
			<Row>
				<RuleConstructor onSubmit={updateRules} />
			</Row>
			<Row>
				<Col xs={12} sm={6}>
					<Form onSubmit={e => e.preventDefault()}>
						<FormGroup>
							<Col>
								<Form.Label htmlFor="SearchSeeds.seed">
									Start search from seed:{' '}
								</Form.Label>
								<Form.Control
									id="SearchSeeds.seed"
									type="number"
									disabled={running}
									value={seed}
									onChange={handleSeedStartChange}
								/>
							</Col>
							<Col>
								<Form.Label htmlFor="SearchSeeds.seedEnd">
									End search at seed:{' '}
								</Form.Label>
								<Form.Control
									id="SearchSeeds.seedEnd"
									type="number"
									placeholder="Optional"
									disabled={running}
									value={seedEnd}
									onChange={handleSeedEndChange}
								/>
							</Col>
						</FormGroup>
					</Form>
				</Col>
				<Col />
			</Row>
			<Row>
				<Col className="m-3">
					{navigator.hardwareConcurrency && (
						<Col className="">
							<Row className="m-3">
								<Button
									onClick={handleMultithreading}
									variant={useCores > 1 ? 'success' : 'secondary'}
								>
									Multithreading {useCores > 1 ? 'on' : 'off'}
								</Button>
							</Row>
							<Row className="m-3">
								Multithreading will slow down your PC, but will use almost all
								cores of the CPU. PC performance will suffer. You may get
								several results at once if you have enough cores.
							</Row>
						</Col>
					)}
					<Row className="p-3">
						<ButtonGroup>
							<Button
								color="primary"
								disabled={running}
								onClick={() => startCalculation()}
							>
								Find next
							</Button>
							<Button
								color="primary"
								disabled={!running}
								onClick={() => stopCalculation()}
							>
								Stop
							</Button>
						</ButtonGroup>
					</Row>
				</Col>
			</Row>
			<Container>
				{solverInfo[0]?.running && <div>
					<ProgressBar animated now={percentChecked} label={`${percentChecked}%`} />
					Seeds checked: {localizeNumber(seedsChecked)} / {localizeNumber(totalSeeds)} (Estimated time left: {humanize((solverInfo[0] as any).msLeft, { round: true, units: ["h", "m"] })})
				</div>}
				<h6>Results:</h6>
				<Stack gap={5}>
					{solverInfo.map((info, index) => (
						<Container
							className="mb-4"
							key={info.foundSeed || info.currentSeed}
						>
							{info.foundSeed && (
								<SeedDataOutput seed={`${info.currentSeed}`} />
							)}
						</Container>
					))}
				</Stack>
			</Container>
		</Container>
	);
};

export default SearchSeeds;
