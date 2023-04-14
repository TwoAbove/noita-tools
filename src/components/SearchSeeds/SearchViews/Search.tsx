import React, { useContext } from 'react';
import { Container, Stack, Row, Col, ListGroup, Button, ButtonGroup, Form, FormGroup, ProgressBar } from 'react-bootstrap';
import humanize from 'humanize-duration';

import { localizeNumber } from '../../../services/helpers';
import SeedDataOutput from '../../SeedInfo/SeedDataOutput';
import { SearchContext } from '../SearchContext';
import UseMultithreadingButton from '../UseMultithreading';
import { Status } from '../../../services/compute/ChunkProvider';
import useLocalStorage from '../../../services/useLocalStorage';

const MemoSeedDataOutput = React.memo(SeedDataOutput);

const Description = () => {
	return (
		<>
			<h4 className="mb-3">Find a seed with desired parameters</h4>
			<p>Logic operations are available. Logic meta-rules allow you to better filter
				for specific seeds or to make the search more flexible. The top level list of
				rules is an <code>AND</code>, meaning all of the rules inside the <code>AND</code>&nbsp;
				need to be true for a seed to be considered "found". You can drag and drop rules and logic
				rules into other logic rules.</p>
			<p><code>AND</code>: All rules must be true.&nbsp;
				<code>OR</code>: Any of the rules must be true. <code>NOT</code>: Negates any rule/logic inside.
				Accepts only one thing.</p>
			<p>To get the same behavior as the old seed search, simply add rules to the root <code>AND</code>.</p>
		</>
	);
};

const Search = () => {
	// TODO: Spilt Search Context into something more manageable
	const {
		seedSolver,
		solverStatus,
		solverReady,
		chunkProvider,

		clusterHelpAvailable,
		clusterHelpEnabled,
		toggleClusterHelp,

		handleCopy,
		startCalculation,
		stopCalculation,
		handleSeedStartChange,
		handleSeedEndChange,
		handleCustomSeedListChange,
		setFindAll,
		findAll,
		running,
		seed,
		seedEnd,
		customSeedList,
		seedsChecked,
		totalSeeds,
		percentChecked,
		seedsPerSecond,
	} = useContext(SearchContext);

	const [profileOpen, setProfileOpen] = useLocalStorage('profile-open', false);

	const openProfile = () => {
		setProfileOpen(true);
	}

	return (<Container fluid className="col pt-3 shadow-lg">
		<Description />
		<Row>
			{/* <RuleConstructor onSubmit={updateRules} /> */}
		</Row>
		<Row>
			<Col xs={12} sm={6} md={5} >
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
									disabled={running || !solverReady}
									value={seed}
									onChange={handleSeedStartChange}
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
									disabled={running || !solverReady}
									value={seedEnd}
									onChange={handleSeedEndChange}
								/>
							</Form.Group>
						</Col>
						<Col>
							<Form.Group className='mt-3'>
								<Form.Label htmlFor="SearchSeeds.seedEnd">
									Or, input a list of seeds (slower, best for filtering):{' '}
								</Form.Label>
								<Form.Control
									id="SearchSeeds.seedList"
									type="text"
									placeholder="Optional"
									disabled={running || !solverReady}
									value={customSeedList}
									onChange={handleCustomSeedListChange}
								/>
								{customSeedList
									&& <Form.Text className="text-muted">
										{chunkProvider.customSeeds?.length} seeds left
									</Form.Text>
								}
							</Form.Group>
						</Col>
						<Col>
							<Form.Group className='mt-3'>
								<Form.Check
									checked={findAll}
									disabled={!solverReady}
									onChange={e => {
										setFindAll(e.target.checked);
									}}
									id={`find-all-switch`}
									label="Don't stop searching when a seed is found"
								/>
							</Form.Group>
						</Col>
					</FormGroup>
				</Form>
			</Col>
			{/* <Col /> */}
			<Col md={7} className="p-3">
				<Row>

					{navigator.hardwareConcurrency && (
						<Col className="">
							<Row className="m-3">
								<UseMultithreadingButton />
							</Row>
							<Row className="m-3">
								<p>
									Multithreading will use as many CPU threads as possible,
									but slow down your PC. PC performance may suffer, as well as battery life. You may get
									several results at once if you have enough cores.
								</p>
							</Row>
						</Col>
					)}
					{false && <Col className="">
						<Row className="m-3">
							<Button
								variant="outline-primary"
								onClick={toggleClusterHelp}
							>
								{clusterHelpEnabled ? 'Disable' : 'Enable'} cluster compute
							</Button>
						</Row>
						<Row className='m-3'>
							{clusterHelpAvailable && <>
								Offload part of the work to a compute cluster.
								See details in your profile page.
							</>}
							{!clusterHelpAvailable && <p>
								Offloading part of the work to a compute cluster is <b>not available</b>.
								<br />
								See details in your <Button size='sm' variant='outline-primary' onClick={() => openProfile()}>profile page</Button>
							</p>}
						</Row>
					</Col>}
				</Row>
				<Row className="p-3">
					<ButtonGroup>
						<Button
							color="primary"
							disabled={running || !solverReady}
							onClick={() => startCalculation()}
						>
							{!solverReady ? 'Loading searcher' : 'Find next'}
						</Button>
						<Button
							color="primary"
							disabled={!running || !solverReady}
							onClick={() => stopCalculation()}
						>
							Stop
						</Button>
					</ButtonGroup>
				</Row>
			</Col>
		</Row>
		<div>
			{!chunkProvider?.customSeeds && solverStatus?.running && <div>
				<ProgressBar animated now={percentChecked} label={`${percentChecked}%`} />
				Seeds checked: {localizeNumber(seedsChecked)} / {localizeNumber(totalSeeds)} (Estimated time left: {humanize((solverStatus as Status).estimate * 1000, { round: true, units: ["h", "m"] })}, {seedsPerSecond} avg seeds/s)
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
				!findAll && solverStatus?.results[0] && <Stack gap={5}>
					{<div
						className="mb-4"
						key={solverStatus?.results[0]}
					>
						<MemoSeedDataOutput key={solverStatus?.results[0]} seed={`${solverStatus?.results[0]}`} />
					</div>
					}
				</Stack>
			}

		</div>
	</Container>);
};

export default Search;
