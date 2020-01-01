import React from 'react';
import useComlink, { createComlink } from 'react-use-comlink';
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
	Spinner
} from 'reactstrap';

import { MaterialPicker } from '../../services/Calculator2';

import ListSelect from '../ListSelect';

import { SeedSolver as _SeedSolver } from '../../workers/seedCalculator';
import SeedSolverWorker from '../../workers/seedCalculator.worker';

import MaterialList from '../RecipesForSeed/MaterialList';

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
		sm: '6',
		ml: '3'
	};
	return (
		<Row>
			<Col {...ColProps}>
				<Row>
					<Col>
						<p {...(!enoughAlchemy ? { className: 'text-danger' } : {})}>
							At least one (1) of:
						</p>
					</Col>
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
				<ListSelect
					items={MaterialPicker.ALCHEMY}
					selected={selected}
					onUpdate={selected => onUpdate(selected)}
				/>
			</Col>
			<Col {...ColProps}>
				<Row>
					<Col>
						<p {...(!enoughLiquids ? { className: 'text-danger' } : {})}>
							At least two (2) of:{' '}
						</p>
					</Col>
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
				<ListSelect
					items={MaterialPicker.LIQUIDS}
					selected={selected}
					onUpdate={selected => onUpdate(selected)}
				/>
			</Col>
		</Row>
	);
};

const enoughLiquids = (selected: Set<string>) =>
	MaterialPicker.LIQUIDS.filter(value => selected.has(value)).length >= 2;
const enoughAlchemy = (selected: Set<string>) =>
	MaterialPicker.ALCHEMY.filter(value => selected.has(value)).length >= 1;

const useSeedSolver = createComlink<typeof _SeedSolver>(
	() => new SeedSolverWorker()
);

const SeedFromRecipes = () => {
	const [apIngredientsSelected, setApIngredientsSelected] = React.useState<
		Set<string>
	>(new Set());
	const [lcIngredientsSelected, setLcIngredientsSelected] = React.useState<
		Set<string>
	>(new Set());

	const SeedSolver = useSeedSolver();

	const [seed, setSeed] = React.useState('');
	const handleSeedChange = (e: any) => {
		setSeed(e.target.value);
	};

	const [solverInfo, setSolverInfo] = React.useState<any>({});
	const getSeedSolver = async (): Promise<any> => {
		const newSeedSolver = SeedSolver.proxy;
		return await newSeedSolver;
	};

	const update = async () => {
		const solver = await getSeedSolver();
		if (!solver) return;
		const info = await solver.getInfo();
		setSolverInfo({ ...info });
	};

	React.useEffect(() => {
		const id = setInterval(() => update(), 250);
	}, []);

	React.useEffect(
		() => {
			const work = async () => {
				const solver = await getSeedSolver();

				await solver.update({
					apIngredients: Array.from(apIngredientsSelected),
					lcIngredients: Array.from(lcIngredientsSelected)
				});
			};
			work();
		},
		[apIngredientsSelected, lcIngredientsSelected]
	);

	React.useEffect(
		() => {
			const work = async () => {
				const solver = await getSeedSolver();
				const newSeed = parseInt(seed);
				if (isNaN(newSeed)) {
					return;
				}
				await solver.update({
					currentSeed: newSeed
				});
			};

			work();
		},
		[seed]
	);

	const startCalculation = async () => {
		const solver = await getSeedSolver();
		if (solver) {
			await solver.start();
		}
	};
	const stopCalculation = async () => {
		const solver = await getSeedSolver();
		if (solver) {
			await solver.stop();
		}
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
		<Container className="container shadow-sm">
			<h4>Calculate a seed from the desired LC and AP ingredients</h4>
			<p>Lists can be left blank if any combination will do. </p>
			<p>
				The resulting seed's LC and AP ingredients will be from the selected
				values.
			</p>
			<Row>
				<Container>
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
				<Container>
					<Row>
						<p>Alchemic Precursor:</p>z
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
									disabled={solverInfo.running}
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
				<Col>
					<ButtonGroup>
						<Button
							color="primary"
							disabled={solverInfo.running || !hasEnoughAll}
							onClick={() => startCalculation()}
						>
							Find next
						</Button>
						<Button
							color="primary"
							disabled={!solverInfo.running}
							onClick={() => stopCalculation()}
						>
							Stop
						</Button>
					</ButtonGroup>
				</Col>
			</Row>
			{solverInfo.running && (
				<Row>
					<Col>
						<Spinner type="grow" color="info" />
					</Col>
				</Row>
			)}
			{!solverInfo.running && (
				<Row>
					<Col>
						Current seed : {solverInfo.currentSeed}
						{solverInfo.foundSeed && (
							<MaterialList LC={solverInfo.LC} AP={solverInfo.AP} />
						)}
					</Col>
				</Row>
			)}
		</Container>
	);
};

export default SeedFromRecipes;
