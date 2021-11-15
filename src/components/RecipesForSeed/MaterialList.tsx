import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

interface IMaterialListProps {
	LC: string[];
	AP: string[];
}

const MaterialList = (props: IMaterialListProps) => {
	const { LC, AP } = props;
	return (
		<div>
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

export default MaterialList;
