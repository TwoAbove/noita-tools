import React from 'react';
import { Jumbotron, Container, Row, Col, Button } from 'reactstrap';

import { MaterialPicker } from '../../services/Calculator2';

import ListSelect from '../ListSelect';

// eslint-disable-next-line import/no-webpack-loader-syntax
import SeedCalculator from '../../workers/seedCalculator.worker';
console.log('SeedCalculator', SeedCalculator);
const seedCalculator = (SeedCalculator as any)() as any;

interface IRecipeIngredientsPickerProps {
	enoughLiquids: boolean;
	enoughAlchemy: boolean;

	selected: Set<string>;
	onUpdate: (selected: Set<string>) => void;
}
const RecipeIngredientsPicker = (props: IRecipeIngredientsPickerProps) => {
	const { selected, onUpdate, enoughLiquids, enoughAlchemy } = props;
	const ColProps = {
		xs: '12',
		sm: '6',
		ml: '3'
	};
	return (
		<Row>
			<Col {...ColProps}>
				<p {...(!enoughAlchemy ? { className: 'text-danger' } : {})}>
					At least one (1) of:
				</p>
				<ListSelect
					items={MaterialPicker.ALCHEMY}
					selected={selected}
					onUpdate={selected => onUpdate(selected)}
				/>
			</Col>
			<Col {...ColProps}>
				<p {...(!enoughLiquids ? { className: 'text-danger' } : {})}>
					At least two (2) of:{' '}
				</p>
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

const SeedFromRecipes = () => {
	const [apIngredientsSelected, setApIngredientsSelected] = React.useState<
		Set<string>
	>(new Set());
	const [lcIngredientsSelected, setLcIngredientsSelected] = React.useState<
		Set<string>
	>(new Set());

	const startCalculation = () => {
		console.log('Calculating');
		console.log('apIngredientsSelected', apIngredientsSelected);
		console.log('lcIngredientsSelected', lcIngredientsSelected);
		seedCalculator.expensive(1000).then((amount: any) => {
			console.log('Done', amount);
		});
	};

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
					/>
				</Container>
				<Container>
					<Row>
						<p>Alchemic Precursor:</p>
					</Row>
					<RecipeIngredientsPicker
						selected={apIngredientsSelected}
						onUpdate={setApIngredientsSelected}
						enoughLiquids={enoughLiquids(apIngredientsSelected)}
						enoughAlchemy={enoughAlchemy(apIngredientsSelected)}
					/>
				</Container>
			</Row>
			<Row>
				<Col>
					<Button color="primary" onClick={() => startCalculation()}>
						Submit
					</Button>
				</Col>
			</Row>
		</Container>
	);
};

export default SeedFromRecipes;
