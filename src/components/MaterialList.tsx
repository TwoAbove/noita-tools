import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

interface ISeedFormProps {
	LC: string[];
	AP: string[];
	seed: string;
}

const SeedForm = (props: ISeedFormProps) => {
	const { LC, AP, seed } = props;
	return (
		<div>
			seed: {seed}
			<div>
				Lively Concoction:
				<ListGroup>
					{LC.map(l => <ListGroupItem key={l}>{l}</ListGroupItem>)}
				</ListGroup>
			</div>
			<div>
				Alchemic Precursor:
				<ListGroup>
					{AP.map(l => <ListGroupItem key={l}>{l}</ListGroupItem>)}
				</ListGroup>
			</div>
		</div>
	);
};

export default SeedForm;
