import React from 'react';
import {
	Jumbotron,
	ButtonGroup,
	Form,
	FormGroup,
	Container,
	Input,
	Label,
	Row,
	Col,
	Button,
	Spinner,

} from 'reactstrap';

import { MaterialPicker } from '../../services/Calculator2';

import ListSelect from '../ListSelect';

import { SeedSolver as _SeedSolver } from '../../services/seedCalculator';
import SeedSolverWorker from '../../workers/seedCalculator.worker';

import MaterialList from '../RecipesForSeed/MaterialList';
import SeedSolver from './SeedSolverHandler';

interface IRecipeIngredientsPickerProps {
	enoughLiquids: boolean;
	enoughAlchemy: boolean;

	selected: Set<string>;
	onUpdate: (selected: Set<string>) => void;
	onSelectAll: (part: string) => void;
	onDeselectAll: (part: string) => void;
}
const RecipeIngredientsPicker = (props: IRecipeIngredientsPickerProps) => {
	const {
		selected,
		onSelectAll,
		onDeselectAll,
		onUpdate,
		enoughLiquids,
		enoughAlchemy
	} = props;
	const ColProps = {
		xs: '12',
		lg: '6'
	};
	return (
		<Row>
			<Col {...ColProps}>
				<Row className="justify-content-center p-2">
					<Row>
						<Col>
							<p {...(!enoughAlchemy ? { className: 'text-danger' } : {})}>
								Select none or at least one (1) of:
							</p>
						</Col>
					</Row>
					<Row>
						<Col>
							<ButtonGroup>
								<Button color="primary" onClick={() => onSelectAll('ALCHEMY')}>
									Select All
								</Button>
								<Button color="primary" onClick={() => onDeselectAll('ALCHEMY')}>
									Deselect All
								</Button>
							</ButtonGroup>
						</Col>
					</Row>
				</Row>
				<ListSelect
					items={MaterialPicker.ALCHEMY}
					selected={selected}
					onUpdate={selected => onUpdate(selected)}
				/>
			</Col>
			<Col {...ColProps}>
				<Row className="justify-content-center p-2">
					<Row>
						<Col>
							<p {...(!enoughLiquids ? { className: 'text-danger' } : {})}>
								Select none or at least two (2) of:{' '}
							</p>
						</Col>
					</Row>
					<Row>
						<Col>
							<ButtonGroup>
								<Button color="primary" onClick={() => onSelectAll('LIQUIDS')}>
									Select All
								</Button>
								<Button color="primary" onClick={() => onDeselectAll('LIQUIDS')}>
									Deselect All
								</Button>
							</ButtonGroup>
						</Col>
					</Row>
				</Row>
				<ListSelect
					items={MaterialPicker.LIQUIDS}
					selected={selected}
					onUpdate={selected => onUpdate(selected)}
				/>
			</Col>
		</Row>
	);
};

const enoughLiquids = (selected: Set<string>) => {
	const liquids = MaterialPicker.LIQUIDS.filter(value => selected.has(value));
	return liquids.length === 0 || liquids.length >= 2;
};
const enoughAlchemy = (selected: Set<string>) => {
	const alchemy = MaterialPicker.ALCHEMY.filter(value => selected.has(value));
	return alchemy.length === 0 || alchemy.length >= 1;
};

const SeedFromRecipes = () => {
	const [apIngredientsSelected, setApIngredientsSelected] = React.useState<Set<string>>(new Set());
	const [lcIngredientsSelected, setLcIngredientsSelected] = React.useState<Set<string>>(new Set());
	const [useCores, setUseCores] = React.useState<number>(1);
	const [seedSolver, setSeedSolver] = React.useState(new SeedSolver(useCores));

	const [seed, setSeed] = React.useState('');
	const handleSeedChange = (e: any) => {
		setSeed(e.target.value);
	};

	const [solverInfo, setSolverInfo] = React.useState<ReturnType<SeedSolver["getInfo"]>>([]);
	const running = solverInfo.find(info => info.running) !== undefined;
	const update = async () => {
		const info = seedSolver.getInfo();
		if (info.length) {
			setSolverInfo(info);
		}
	};

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
		const id = setInterval(() => update(), 1000);
		return () => clearInterval(id);
	});

	React.useEffect(
		() => {
			const work = async () => {
				await seedSolver.destroy();
				const newSeedSolver = new SeedSolver(useCores);
				const newSeed = parseInt(seed);
				newSeedSolver.update({
					apIngredients: Array.from(apIngredientsSelected),
					lcIngredients: Array.from(lcIngredientsSelected),
					currentSeed: newSeed
				});
				if (!isNaN(newSeed)) {
					newSeedSolver.update({
						currentSeed: newSeed
					});
				}

				setSeedSolver(newSeedSolver);
			};
			work();
		},
		[useCores]
	);

	React.useEffect(
		() => {
			seedSolver.update({
				apIngredients: Array.from(apIngredientsSelected),
				lcIngredients: Array.from(lcIngredientsSelected)
			});
		},
		[apIngredientsSelected, lcIngredientsSelected]
	);

	React.useEffect(
		() => {

			const newSeed = parseInt(seed);
			if (isNaN(newSeed)) {
				return;
			}
			seedSolver.update({
				currentSeed: newSeed
			});
		},
		[seed]
	);

	const startCalculation = async () => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				lcIngredientsSelected: [...lcIngredientsSelected],
				apIngredientsSelected: [...apIngredientsSelected]
			})
		};
		fetch('/data', requestOptions);

		await seedSolver.start();
	};

	const stopCalculation = async () => {
		await seedSolver.stop();
	};

	const handleSelectAll = (update: any, set: Set<string>) => (type: string) => {
		let newSet = new Set(...set);
		const materials =
			type === 'ALCHEMY' ? MaterialPicker.ALCHEMY : MaterialPicker.LIQUIDS;
		newSet = new Set([...set, ...materials]);
		update(newSet);
	};

	const handleDeselectAll = (update: any, set: Set<string>) => (
		type: string
	) => {
		let newSet = new Set(...set);
		const materials =
			type === 'ALCHEMY' ? MaterialPicker.ALCHEMY : MaterialPicker.LIQUIDS;
		newSet = new Set([...set].filter(x => !materials.includes(x)));
		update(newSet);
	};

	const hasEnoughLiquids =
		enoughLiquids(lcIngredientsSelected) &&
		enoughLiquids(apIngredientsSelected);
	const hasEnoughAlchemy =
		enoughAlchemy(lcIngredientsSelected) &&
		enoughAlchemy(apIngredientsSelected);
	const hasEnoughAll = hasEnoughLiquids && hasEnoughAlchemy;
	return (
		<Container className="col container shadow-lg">
			<h4>Calculate a seed from the desired LC and AP ingredients</h4>
			<p>Lists can be left blank if any combination will do. </p>
			<p>
				The resulting seed's LC and AP ingredients will be from the selected
				values.
			</p>
			<p>
				Do keep in mind that some combinations may not be possible.
			</p>
			<Row>
				<Container className="col container-sm">
					<p>Lively Concoction:</p>
					<RecipeIngredientsPicker
						selected={lcIngredientsSelected}
						onUpdate={setLcIngredientsSelected}
						enoughLiquids={enoughLiquids(lcIngredientsSelected)}
						enoughAlchemy={enoughAlchemy(lcIngredientsSelected)}
						onSelectAll={handleSelectAll(
							setLcIngredientsSelected,
							lcIngredientsSelected
						)}
						onDeselectAll={handleDeselectAll(
							setLcIngredientsSelected,
							lcIngredientsSelected
						)}
					/>
				</Container>
				<Container className="col container-sm">
					<Row>
						<p>Alchemic Precursor:</p>
					</Row>
					<RecipeIngredientsPicker
						selected={apIngredientsSelected}
						onUpdate={setApIngredientsSelected}
						enoughLiquids={enoughLiquids(apIngredientsSelected)}
						enoughAlchemy={enoughAlchemy(apIngredientsSelected)}
						onSelectAll={handleSelectAll(
							setApIngredientsSelected,
							apIngredientsSelected
						)}
						onDeselectAll={handleDeselectAll(
							setApIngredientsSelected,
							apIngredientsSelected
						)}
					/>
				</Container>
			</Row>
			<Row>
				<Col xs={12} sm={6}>
					<Form className="seedForm" onSubmit={e => e.preventDefault()}>
						<FormGroup className="formGroup" row>
							<Label for="SeedFromRecipes.seed">Start search from seed: </Label>
							<Col>
								<Input
									id="SeedFromRecipes.seed"
									type="number"
									disabled={running}
									value={seed}
									onChange={handleSeedChange}
								/>
							</Col>
						</FormGroup>
					</Form>
				</Col>
				<Col />
			</Row>
			<Row>
				<Col className="m-3">
					{navigator.hardwareConcurrency &&
						<Col className="m-3">
							<Row className="m-3">
								<Button onClick={handleMultithreading} color={useCores > 1 ? 'success' : 'secondary'}>
									Multithreading {useCores > 1 ? 'on' : 'off'}
								</Button>
							</Row>
							<Row className="m-3">
								Multithreading will slow down your PC, but will use the whole CPU. You may get several results at once if you have enough cores.
							</Row>
						</Col>
					}
					<Row className="m-3">
						<ButtonGroup>
							<Button
								color="primary"
								disabled={running || !hasEnoughAll}
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
			{running && (
				<Row>
					<Col>
						<Spinner type="grow" color="info" />
					</Col>
				</Row>
			)}
			<Container>
				<Row>
					{solverInfo.map((info, index) => (
						<Col className="mb-4" xs={6} md={3} key={info.foundSeed}>
							Current seed: {info.currentSeed}
							{info.foundSeed && (
								<MaterialList LC={info.LC} AP={info.AP} />
							)}
						</Col>
					))}
				</Row>
			</Container>

		</Container>
	);
};

export default SeedFromRecipes;
