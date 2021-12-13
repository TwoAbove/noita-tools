import React from 'react';
import { Container, ListGroup, ListGroupItem, Stack } from 'react-bootstrap';

import GameInfoProvider from '../../../services/SeedInfo/infoHandler';
import { capitalize } from '../../../services/helpers';

interface IAlchemyProps {
	alchemy: {
		LC: string[];
		AP: string[]
	}
	infoProvider: GameInfoProvider;
}

const Alchemy = (props: IAlchemyProps) => {
	const { alchemy, infoProvider } = props;
	return (
		<Container>
			<Stack direction="horizontal">
				<div>
					Lively Concoction:
					<ListGroup>
						{alchemy.LC.map(l => (
							<ListGroupItem key={l}>
								{capitalize(
									infoProvider.providers.material.provide(l).translated_name
								)}
							</ListGroupItem>
						))}
					</ListGroup>
				</div>
        <div className="p-2 flex-grow-1" />
				<div>
					Alchemic Precursor:
					<ListGroup>
						{alchemy.AP.map(l => (
							<ListGroupItem key={l}>
								{capitalize(
									infoProvider.providers.material.provide(l).translated_name
								)}
							</ListGroupItem>
						))}
					</ListGroup>
				</div>
			</Stack>
		</Container>
	);
};

export default Alchemy;
