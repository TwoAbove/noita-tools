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
	ProgressBar,
	ListGroup
} from 'react-bootstrap';
import copy from 'copy-to-clipboard';
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
	const [useCores, setUseCores] = useLocalStorage('useCores', 1);
	const [seedSolver, setSeedSolver] = React.useState(
		() => new SeedSolver(useCores, true)
	);
	const [seed, setSeed] = React.useState('1');
	const [seedEnd, setSeedEnd] = React.useState('');
	const [findAll, setFindAll] = React.useState(false);
	const handleSeedStartChange = (e: any) => {
		setSeed(e.target.value);
	};
	const handleSeedEndChange = (e: any) => {
		setSeedEnd(e.target.value);
	};

	const [[solverInfo, ...results], setSolverInfo] = React.useState<
		ReturnType<SeedSolver['getInfo']>
	>([]);
	const running = !!solverInfo?.running;

	const handleMultithreading = () => {
		const concurrency = navigator.hardwareConcurrency || 1;
		setUseCores(concurrency);
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
			const newSeedSolver = new SeedSolver(useCores, !findAll);
			const newSeed = parseInt(seed);
			const newSeedEnd = parseInt(seedEnd);
			newSeedSolver.update({
				rules: [],
				currentSeed: newSeed,
				seedEnd: newSeedEnd,
				findAll,
			});
			if (!isNaN(newSeed)) {
				newSeedSolver.update({
					currentSeed: newSeed,
					seedEnd: newSeedEnd,
					findAll
				});
			}
			setSeedSolver(newSeedSolver);
		};
		work(); // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [useCores, seed, seedEnd, findAll]);
	// ^
	// seedSolver is both used and set here, so running this
	// again will create a loop
	// useEffect is used here idiomatically, but I'm not sure how to better do this


	const handleCopy = () => {
		const seedList = seedSolver.foundSeeds;
		copy(seedList.join(','));
	}

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

	const seedsChecked = avg(results.map(i => i.currentSeed));
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
							<Col>
								<Form.Label htmlFor="SearchSeeds.findAll">
									Find all seeds and list them below
								</Form.Label>
								<Form.Switch
									checked={findAll}
									onChange={e => {
										setFindAll(e.target.checked);
									}}
									id={`find-all-switch`}
									label=""
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
				{solverInfo?.running && <div>
					<ProgressBar animated now={percentChecked} label={`${percentChecked}%`} />
					Seeds checked: {localizeNumber(seedsChecked)} / {localizeNumber(totalSeeds)} (Estimated time left: {humanize((solverInfo as any).msLeft, { round: true, units: ["h", "m"] })})
				</div>}
				<h6>Results:</h6>
				{findAll && <div>
					Found {seedSolver.foundSeeds.length} seeds: <br />
					<Button onClick={handleCopy}>Copy seed list to clipboard</Button>
					<ListGroup style={
						{
							overflowY: 'auto',
							height: '100px',
						}
					}>
						{seedSolver.foundSeeds.map(s => {
							return <ListGroup.Item variant="flush" key={s}>{s}</ListGroup.Item>
						})}
					</ListGroup>
				</div>}
				{
					!findAll && <Stack gap={5}>
						{results.map((info, index) => (
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
				}

			</Container>
		</Container>
	);
};

export default SearchSeeds;
