import React from 'react';
import { Container, ListGroup, ListGroupItem, Stack } from 'react-bootstrap';

import GameInfoProvider from '../../../services/SeedInfo/infoHandler';
import { capitalize } from '../../../services/helpers';

interface IAlchemyProps {
	LC: string[];
	AP: string[];
	infoProvider: GameInfoProvider;
}

const Alchemy = (props: IAlchemyProps) => {
	const { LC, AP, infoProvider } = props;
	return (
		<Container>
			<Stack direction="horizontal">
				<div>
					Lively Concoction:
					<ListGroup>
						{LC.map(l => (
							<ListGroupItem key={l}>
								{capitalize(
									infoProvider.providers.material.provide(l).translated_name
								)}
							</ListGroupItem>
						))}
					</ListGroup>
				</div>
        <div className="ms-auto" />
				<div>
					Alchemic Precursor:
					<ListGroup>
						{AP.map(l => (
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
