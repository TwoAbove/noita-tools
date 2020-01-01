import React from 'react';
import { Jumbotron, Container, Row, Col, Button } from 'reactstrap';

import MaterialList from '../RecipesForSeed/MaterialList';

interface ISeedSearchResultProps {
	LC: string[];
	AP: string[];
	seed: string;
}
const SeedSearchResult = (props: ISeedSearchResultProps) => {
	const { seed, LC, AP } = props;
	return (
		<div>
			Seed: {seed}
			<MaterialList LC={LC} AP={AP} />
		</div>
	);
};

export default SeedSearchResult;
