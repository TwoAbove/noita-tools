import React, { useContext } from 'react';
import { Container, Stack, Row, Col, ListGroup, Button, ButtonGroup, Form, FormGroup, ProgressBar } from 'react-bootstrap';
import humanize from 'humanize-duration';

import { localizeNumber } from '../../../services/helpers';
import SeedDataOutput from '../../SeedInfo/SeedDataOutput';
import { SearchContext } from '../SearchContext';
import UseMultithreadingButton from '../UseMultithreading';

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
	const {
		seedSolver,
		solverInfo,
		results,
		handleCopy,
		startCalculation,
		stopCalculation,
		handleSeedStartChange,
		handleSeedEndChange,
		setFindAll,
		findAll,
		running,
		seed,
		seedEnd,
		seedsChecked,
		totalSeeds,
		percentChecked,
		seedsPerSecond
	} = useContext(SearchContext);

	return (<Container fluid className="col pt-3 shadow-lg">
		<Description />
		<Row>
			{/* <RuleConstructor onSubmit={updateRules} /> */}
		</Row>
		<Row>
			<Col xs={12} sm={6} md={6} >
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
									disabled={running}
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
									disabled={running}
									value={seedEnd}
									onChange={handleSeedEndChange}
								/>
							</Form.Group>
						</Col>
						<Col>
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
						</Col>
					</FormGroup>
				</Form>
			</Col>
			{/* <Col /> */}
			<Col md={6} className="p-3">
				{navigator.hardwareConcurrency && (
					<Col className="">
						<Row className="m-3">
							<UseMultithreadingButton />
						</Row>
						<Row className="m-3">
							Multithreading will use as many CPU threads as possible,
							but slow down your PC. PC performance may suffer, as well as battery life. You may get
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
		<div>
			{solverInfo?.running && <div>
				<ProgressBar animated now={percentChecked} label={`${percentChecked}%`} />
				Seeds checked: {localizeNumber(seedsChecked)} / {localizeNumber(totalSeeds)} (Estimated time left: {humanize((solverInfo as any).msLeft, { round: true, units: ["h", "m"] })}, {seedsPerSecond} avg seeds/s)
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
					{results.map((info, index) => {
						return (
							<div
								className="mb-4"
								key={info.foundSeed || info.currentSeed}
							>
								{info.foundSeed && (
									<MemoSeedDataOutput key={info.currentSeed} seed={`${info.currentSeed}`} />
								)}
							</div>
						)
					})}
				</Stack>
			}

		</div>
	</Container>);
};

export default Search;
